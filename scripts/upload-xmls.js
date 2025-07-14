const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

// Função para fazer delay entre requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Função para parsear XML e extrair produtos
function parseXmlProducts(xmlContent) {
  // Simular DOMParser no Node.js usando regex (básico)
  const products = [];
  
  // Determinar tipo de operação (entrada ou saída)
  const tpNFMatch = xmlContent.match(/<tpNF>(\d+)<\/tpNF>/);
  const operationType = tpNFMatch && tpNFMatch[1] === '0' ? 'entrada' : 'saída';
  
  // Extrair produtos usando regex
  const detRegex = /<det nItem="\d+">(.*?)<\/det>/gs;
  let detMatch;
  
  while ((detMatch = detRegex.exec(xmlContent)) !== null) {
    const detContent = detMatch[1];
    
    // Extrair dados do produto
    const nameMatch = detContent.match(/<xProd>(.*?)<\/xProd>/);
    const quantityMatch = detContent.match(/<qCom>(.*?)<\/qCom>/);
    const priceMatch = detContent.match(/<vUnCom>(.*?)<\/vUnCom>/);
    
    if (nameMatch && quantityMatch && priceMatch) {
      const name = nameMatch[1];
      const quantity = parseFloat(quantityMatch[1]);
      const precoUnitario = parseFloat(priceMatch[1]);
      
      products.push({
        name,
        quantity,
        precoUnitario,
        storage: 'almoxarifado', // Default
        description: `${operationType === 'entrada' ? 'Entrada' : 'Saída'} via NF - ${name}`,
        operationType
      });
    }
  }
  
  return products;
}

// Função para buscar primeiro projeto e fornecedor disponíveis
async function getDefaultProjectAndSupplier() {
  try {
    const [projectsResponse, suppliersResponse] = await Promise.all([
      axios.get(`${BASE_URL}/api/project`),
      axios.get(`${BASE_URL}/api/supplier`)
    ]);
    
    const project = projectsResponse.data[0];
    const supplier = suppliersResponse.data[0];
    
    return {
      project_id: project?.id,
      supplier_id: supplier?.id,
      projectName: project?.name,
      supplierName: supplier?.corporate_name
    };
  } catch (error) {
    console.error('Erro ao buscar projeto e fornecedor padrão:', error.message);
    return { project_id: null, supplier_id: null };
  }
}

async function uploadXmlFiles() {
  console.log('📄 Processando arquivos XML e criando produtos...\n');
  
  // Buscar projeto e fornecedor padrão
  console.log('🔍 Buscando projeto e fornecedor padrão...');
  const { project_id, supplier_id, projectName, supplierName } = await getDefaultProjectAndSupplier();
  
  if (!project_id || !supplier_id) {
    console.error('❌ Não foi possível encontrar projeto ou fornecedor padrão. Execute primeiro o script de população do banco.');
    return;
  }
  
  console.log(`✅ Usando projeto: ${projectName}`);
  console.log(`✅ Usando fornecedor: ${supplierName}\n`);
  
  // Lista de arquivos XML para processar
  const xmlFiles = [
    'nf_entrada_materiais_construcao.xml',
    'nf_saida_equipamentos.xml', 
    'nf_entrada_eletronicos.xml',
    'nf_entrada_moveis_escritorio.xml',
    'nf_saida_material_escritorio.xml',
    'nf_entrada_produtos_limpeza.xml'
  ];

  let totalItemsCreated = 0;
  let totalFilesProcessed = 0;

  for (const filename of xmlFiles) {
    try {
      const filePath = path.join(process.cwd(), filename);
      
      // Verificar se o arquivo existe
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Arquivo ${filename} não encontrado, pulando...`);
        continue;
      }

      console.log(`\n📄 Processando ${filename}...`);

      // Ler o arquivo XML
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // 1. Upload para S3
      try {
        const base64Data = Buffer.from(fileContent).toString('base64');
        const dataUrl = `data:application/xml;base64,${base64Data}`;

        console.log(`📤 Enviando ${filename} para o S3...`);
        
        const s3Response = await axios.post(`${BASE_URL}/api/aws/s3`, {
          file: dataUrl,
          fileName: filename,
          contentType: 'application/xml'
        });

        if (s3Response.status === 200) {
          console.log(`✅ ${filename} enviado com sucesso para S3`);
        }
      } catch (s3Error) {
        console.error(`⚠️  Erro no upload S3 para ${filename}:`, s3Error.response?.data || s3Error.message);
        // Continua mesmo se o S3 falhar
      }

      // 2. Parsear produtos do XML
      console.log(`🔍 Extraindo produtos de ${filename}...`);
      const products = parseXmlProducts(fileContent);
      
      if (products.length === 0) {
        console.log(`⚠️  Nenhum produto encontrado em ${filename}`);
        continue;
      }

      console.log(`📦 Encontrados ${products.length} produtos`);

      // 3. Criar produtos via API
      let itemsCreatedFromFile = 0;
      
      for (const product of products) {
        try {
          // Verificar se o item já existe
          const existingResponse = await axios.get(`${BASE_URL}/api/items`);
          const existingItem = existingResponse.data.find(item => item.name === product.name);
          
          if (existingItem) {
            console.log(`⚠️  Item já existe: ${product.name}`);
            continue;
          }

          // Criar novo item
          const itemData = {
            name: product.name,
            storage: product.storage,
            description: product.description,
            quantity: product.quantity,
            precoUnitario: product.precoUnitario,
            project_id,
            supplier_id
          };

          const response = await axios.post(`${BASE_URL}/api/items`, itemData);
          
          if (response.data?.id) {
            console.log(`✅ Item criado: ${product.name} (${product.quantity}x R$ ${product.precoUnitario})`);
            
            // Criar movimentação de estoque
            try {
              const stockData = {
                item_id: response.data.id,
                quantity: product.quantity,
                type: product.operationType,
                description: `${product.operationType === 'entrada' ? 'Entrada' : 'Saída'} automática de ${product.name} via importação de NF`,
                documentUrl: `/api/aws/s3/${encodeURIComponent(filename)}`,
                documentName: filename
              };

              await axios.post(`${BASE_URL}/api/estoque`, stockData);
              console.log(`📈 Movimentação de estoque criada: ${product.operationType} de ${product.quantity} unidades`);
              
            } catch (stockError) {
              console.error(`⚠️  Erro ao criar movimentação de estoque para ${product.name}:`, stockError.response?.data || stockError.message);
            }
            
            itemsCreatedFromFile++;
            totalItemsCreated++;
          }

          await delay(500); // Delay entre criações

        } catch (error) {
          console.error(`❌ Erro ao criar item ${product.name}:`, error.response?.data || error.message);
        }
      }

      console.log(`✅ ${itemsCreatedFromFile} itens criados de ${filename}`);
      totalFilesProcessed++;

      await delay(1000); // Delay entre arquivos

    } catch (error) {
      console.error(`❌ Erro ao processar ${filename}:`, error.response?.data || error.message);
    }
  }

  console.log('\n🎉 Processamento de XMLs concluído!');
  console.log(`� Resumo:`);
  console.log(`   - Arquivos processados: ${totalFilesProcessed}`);
  console.log(`   - Itens criados: ${totalItemsCreated}`);
  console.log(`   - Movimentações de estoque criadas: ${totalItemsCreated}`);
  
  if (totalItemsCreated > 0) {
    console.log('\n💡 Próximos passos:');
    console.log('   1. Acesse http://localhost:3000/produtos para ver os produtos criados');
    console.log('   2. Acesse http://localhost:3000/estoque para ver as movimentações');
    console.log('   3. Os XMLs foram salvos no S3 e podem ser baixados pela interface');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  uploadXmlFiles();
}

module.exports = { uploadXmlFiles };
