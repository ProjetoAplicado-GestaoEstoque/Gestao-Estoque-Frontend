const axios = require('axios');
const path = require('path');
const bcrypt = require('bcryptjs');

const BASE_URL = 'http://localhost:3000/';

// Função para criptografar senha
function cryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

// Função para fazer delay entre requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Dados de exemplo
const userData = [
    {
        full_name: "João Silva Santos",
        email: "joao.silva@empresa.com",
        password: cryptPassword("123456"),
        enrollment: "EMP001",
        role: "project_manager",
    },
    {
        full_name: "Maria Oliveira Costa",
        email: "maria.oliveira@empresa.com",
        password: cryptPassword("123456"),
        enrollment: "EMP002",
        role: "tech_responsible",
    },
    {
        full_name: "Carlos Eduardo Lima",
        email: "carlos.lima@empresa.com",
        password: cryptPassword("123456"),
        enrollment: "EMP003",
        role: "project_manager"
    },
    {
        full_name: "Ana Paula Ferreira",
        email: "ana.ferreira@empresa.com",
        password: cryptPassword("123456"),
        enrollment: "EMP004",
        role: "tech_responsible"
    },
    {
        full_name: "Roberto Mendes Silva",
        email: "roberto.mendes@empresa.com",
        password: cryptPassword("123456"),
        enrollment: "EMP005",
        role: "tech_responsible"
    }
];

const customerData = [
    {
        cnpj: "11.222.333/0001-44",
        email: "contato@construtoraalpha.com.br"
    },
    {
        cnpj: "22.333.444/0001-55",
        email: "financeiro@empresabeta.com.br"
    },
    {
        cnpj: "33.444.555/0001-66",
        email: "compras@industriagamma.com.br"
    },
    {
        cnpj: "44.555.666/0001-77",
        email: "projetos@techsolutions.com.br"
    },
    {
        cnpj: "55.666.777/0001-88",
        email: "obras@deltaengenharia.com.br"
    }
];

const supplierData = [
    {
        corporate_name: "Materiais São Paulo LTDA",
        cnpj: "11.223.344/0001-55",
        phone: "(11) 3333-4444",
        email: "vendas@materiaissp.com.br",
        address: "Av. Industrial, 250 - São Paulo/SP"
    },
    {
        corporate_name: "Eletrônicos Tech LTDA",
        cnpj: "33.445.566/0001-22",
        phone: "(11) 5555-6666",
        email: "comercial@eletrotech.com.br",
        address: "Rua da Tecnologia, 500 - São Paulo/SP"
    },
    {
        corporate_name: "Móveis Corporativos Ltda",
        cnpj: "44.556.677/0001-33",
        phone: "(11) 7777-8888",
        email: "vendas@moveiscorp.com.br",
        address: "Av. dos Móveis, 1200 - São Paulo/SP"
    },
    {
        corporate_name: "Higiene & Limpeza Distribuidora",
        cnpj: "77.889.900/0001-66",
        phone: "(11) 9999-0000",
        email: "pedidos@higienelimpeza.com.br",
        address: "Av. da Limpeza, 888 - São Paulo/SP"
    },
    {
        corporate_name: "Ferramentas & Equipamentos SA",
        cnpj: "88.990.011/0001-77",
        phone: "(11) 1111-2222",
        email: "vendas@ferramentasequip.com.br",
        address: "Rua das Ferramentas, 150 - São Paulo/SP"
    }
];

const projectData = [
    {
        name: "Sistema de Gestão Empresarial",
        instituition: "Universidade de São Paulo",
        description: "Desenvolvimento de sistema completo de gestão empresarial"
    },
    {
        name: "Automação Industrial IoT",
        instituition: "Instituto Tecnológico",
        description: "Projeto de automação industrial com IoT e sensores"
    },
    {
        name: "Aplicativo Mobile E-commerce",
        instituition: "Faculdade de Tecnologia",
        description: "Desenvolvimento de aplicativo mobile para e-commerce"
    },
    {
        name: "Infraestrutura de Rede Empresarial",
        instituition: "Centro de Educação Tecnológica",
        description: "Implementação de infraestrutura de rede corporativa"
    },
    {
        name: "Sistema de Monitoramento Ambiental",
        instituition: "Instituto de Pesquisas Ambientais",
        description: "Sistema para monitoramento de dados ambientais em tempo real"
    }
];

let createdUsers = [];
let createdCustomers = [];
let createdSuppliers = [];
let createdProjects = [];

async function createUsers() {
    console.log('Criando usuários...');

    for (const user of userData) {
        try {
            const response = await axios.post(`${BASE_URL}/api/user/auth/signup`, user);
            createdUsers.push(response.data);
            console.log(`✓ Usuário criado: ${user.full_name}`);
            await delay(500);
        } catch (error) {
            console.error(`✗ Erro ao criar usuário ${user.full_name}:`, error.response?.data || error.message);
        }
    }
}

async function createCustomers() {
    console.log('Criando clientes...');

    for (const customer of customerData) {
        try {
            // Verificar se o cliente já existe pelo CNPJ
            try {
                const existingResponse = await axios.get(`${BASE_URL}api/customer`);
                const existingCustomer = existingResponse.data.find(c => c.cnpj === customer.cnpj);
                
                if (existingCustomer) {
                    console.log(`⚠️  Cliente já existe: ${customer.cnpj}`);
                    createdCustomers.push(existingCustomer);
                    continue;
                }
            } catch (checkError) {
                // Se não conseguir verificar, continua tentando criar
            }

            const response = await axios.post(`${BASE_URL}api/customer`, customer);
            createdCustomers.push(response.data);
            console.log(`✓ Cliente criado: ${customer.cnpj}`);
            await delay(500);
        } catch (error) {
            console.error(`✗ Erro ao criar cliente ${customer.cnpj}:`, error.response?.data || error.message);
        }
    }
}

async function createSuppliers() {
    console.log('Criando fornecedores...');

    for (const supplier of supplierData) {
        try {
            // Verificar se o fornecedor já existe pelo CNPJ
            try {
                const existingResponse = await axios.get(`${BASE_URL}api/supplier`);
                const existingSupplier = existingResponse.data.find(s => s.cnpj === supplier.cnpj);
                
                if (existingSupplier) {
                    console.log(`⚠️  Fornecedor já existe: ${supplier.corporate_name} (${supplier.cnpj})`);
                    createdSuppliers.push(existingSupplier);
                    continue;
                }
            } catch (checkError) {
                // Se não conseguir verificar, continua tentando criar
            }

            const response = await axios.post(`${BASE_URL}api/supplier`, supplier);
            createdSuppliers.push(response.data);
            console.log(`✓ Fornecedor criado: ${supplier.corporate_name}`);
            await delay(500);
        } catch (error) {
            console.error(`✗ Erro ao criar fornecedor ${supplier.corporate_name}:`, error.response?.data || error.message);
        }
    }
}

async function createProjects() {
    console.log('Criando projetos...');

    if (createdUsers.length < 2 || createdCustomers.length < 5) {
        console.error('✗ Não há usuários ou clientes suficientes para criar projetos');
        return;
    }

    // Adicionar IDs dinâmicos aos dados base dos projetos
    const projectsData = projectData.map((project, index) => ({
        ...project,
        project_manager_id: index === 1 || index === 3 
            ? createdUsers.filter(u => u.role === 'project_manager')[1]?.id || createdUsers.find(u => u.role === 'project_manager')?.id
            : createdUsers.find(u => u.role === 'project_manager')?.id,
        tech_responsible_id: index === 1 || index === 4
            ? createdUsers.filter(u => u.role === 'tech_responsible')[1]?.id || createdUsers.find(u => u.role === 'tech_responsible')?.id
            : index === 2
            ? createdUsers.filter(u => u.role === 'tech_responsible')[2]?.id || createdUsers.find(u => u.role === 'tech_responsible')?.id
            : createdUsers.find(u => u.role === 'tech_responsible')?.id,
        customer_id: createdCustomers[index]?.id
    }));

    for (const project of projectsData) {
        try {
            // Verificar se o projeto já existe pelo nome
            try {
                const existingResponse = await axios.get(`${BASE_URL}api/project`);
                const existingProject = existingResponse.data.find(p => p.name === project.name);
                
                if (existingProject) {
                    console.log(`⚠️  Projeto já existe: ${project.name}`);
                    createdProjects.push(existingProject);
                    continue;
                }
            } catch (checkError) {
                // Se não conseguir verificar, continua tentando criar
            }

            const response = await axios.post(`${BASE_URL}api/project`, project);
            createdProjects.push(response.data);
            console.log(`✓ Projeto criado: ${project.name}`);
            await delay(500);
        } catch (error) {
            console.error(`✗ Erro ao criar projeto ${project.name}:`, error.response?.data || error.message);
        }
    }
}

async function createItems() {
    console.log('Criando itens...');

    if (createdProjects.length === 0 || createdSuppliers.length === 0) {
        console.error('✗ Não há projetos ou fornecedores suficientes para criar itens');
        return;
    }

    const itemsData = [
        {
            name: "Notebook Dell Inspiron 15",
            storage: "almoxarifado",
            description: "Notebook para desenvolvimento - Dell Inspiron 15",
            quantity: 5,
            precoUnitario: 2800.00,
            project_id: createdProjects[0]?.id,
            supplier_id: createdSuppliers[1]?.id
        },
        {
            name: "Monitor LED 24 Full HD",
            storage: "almoxarifado",
            description: "Monitor LED 24 polegadas Full HD",
            quantity: 8,
            precoUnitario: 650.00,
            project_id: createdProjects[0]?.id,
            supplier_id: createdSuppliers[1]?.id
        },
        {
            name: "Mesa de Escritório L-Shape",
            storage: "deposito",
            description: "Mesa de escritório formato L para estação de trabalho",
            quantity: 6,
            precoUnitario: 850.00,
            project_id: createdProjects[1]?.id,
            supplier_id: createdSuppliers[2]?.id
        },
        {
            name: "Cadeira Ergonômica Presidente",
            storage: "deposito",
            description: "Cadeira ergonômica para escritório",
            quantity: 8,
            precoUnitario: 680.00,
            project_id: createdProjects[1]?.id,
            supplier_id: createdSuppliers[2]?.id
        },
        {
            name: "Furadeira de Impacto 850W",
            storage: "oficina",
            description: "Furadeira de impacto 850W para instalações",
            quantity: 3,
            precoUnitario: 320.00,
            project_id: createdProjects[2]?.id,
            supplier_id: createdSuppliers[4]?.id
        },
        {
            name: "Cimento Portland 50kg",
            storage: "obra",
            description: "Cimento Portland para construção civil",
            quantity: 50,
            precoUnitario: 28.50,
            project_id: createdProjects[3]?.id,
            supplier_id: createdSuppliers[0]?.id
        },
        {
            name: "Detergente Neutro 5L",
            storage: "almoxarifado",
            description: "Detergente neutro para limpeza geral",
            quantity: 20,
            precoUnitario: 35.00,
            project_id: createdProjects[4]?.id,
            supplier_id: createdSuppliers[3]?.id
        }
    ];

    for (const item of itemsData) {
        try {
            // Verificar se o item já existe pelo nome
            try {
                const existingResponse = await axios.get(`${BASE_URL}api/items`);
                const existingItem = existingResponse.data.find(i => i.name === item.name);
                
                if (existingItem) {
                    console.log(`⚠️  Item já existe: ${item.name}`);
                    continue;
                }
            } catch (checkError) {
                // Se não conseguir verificar, continua tentando criar
            }

            const response = await axios.post(`${BASE_URL}api/items`, item);
            console.log(`✓ Item criado: ${item.name}`);
            await delay(500);
        } catch (error) {
            console.error(`✗ Erro ao criar item ${item.name}:`, error.response?.data || error.message);
        }
    }
}

async function populateDatabase() {
    console.log('🚀 Iniciando população do banco de dados...\n');

    try {
        await createUsers();
        console.log('');

        await createCustomers();
        console.log('');

        await createSuppliers();
        console.log('');

        await createProjects();
        console.log('');

        await createItems();
        console.log('');

        console.log('✅ População do banco de dados concluída com sucesso!');
        console.log(`📊 Resumo:`);
        console.log(`   - Usuários criados: ${createdUsers.length}`);
        console.log(`   - Clientes criados: ${createdCustomers.length}`);
        console.log(`   - Fornecedores criados: ${createdSuppliers.length}`);
        console.log(`   - Projetos criados: ${createdProjects.length}`);

    } catch (error) {
        console.error('❌ Erro durante a população do banco:', error.message);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    populateDatabase();
}

module.exports = { populateDatabase };
