# 🗄️ Gestão de Estoque - Scripts de População do Banco

Este projeto inclui scripts automatizados para popular o banco de dados com dados de teste, facilitando o desenvolvimento e demonstração do sistema.

## 🚀 Início Rápido

Para configurar e popular o banco de dados rapidamente:

```bash
# 1. Configuração completa do projeto
make full-setup

# 2. Em um terminal separado, inicie o servidor
make dev

# 3. Em outro terminal, popule tudo automaticamente
make populate-all

# OU faça passo a passo:
make populate-db    # Popula banco básico
make import-xml     # Processa XMLs e cria produtos
```

## 📋 Comandos Disponíveis

Execute `make help` para ver todos os comandos disponíveis:

### Comandos Principais

| Comando | Descrição |
|---------|-----------|
| `make help` | Mostra todos os comandos disponíveis |
| `make setup` | Instala dependências do projeto |
| `make dev` | Inicia servidor de desenvolvimento |
| `make populate-db` | Popula banco com dados básicos |
| `make import-xml` | Processa XMLs e cria produtos |
| `make populate-all` | Popula banco + processa XMLs |
| `make quick-start` | Setup completo + instruções |

### Comandos de Banco de Dados

| Comando | Descrição |
|---------|-----------|
| `make migrate` | Executa migrações do Prisma |
| `make generate` | Gera cliente Prisma |
| `make reset-db` | ⚠️ Reseta banco (apaga tudo!) |
| `make seed` | Alias para populate-db |

### Comandos de Desenvolvimento

| Comando | Descrição |
|---------|-----------|
| `make build` | Faz build do projeto |
| `make clean` | Remove node_modules e cache |
| `make status` | Mostra status do projeto |
| `make test` | Executa testes |

### Comandos Docker (se configurado)

| Comando | Descrição |
|---------|-----------|
| `make docker-up` | Sobe containers Docker |
| `make docker-down` | Para containers Docker |

## 📊 Dados Criados

O script de população cria:

### 👥 Usuários (5)
- **Gerentes de Projeto**: João Silva, Carlos Lima
- **Responsáveis Técnicos**: Maria Oliveira, Ana Ferreira, Roberto Mendes

### 🏢 Clientes (5)
- Construtora Alpha
- Empresa Beta  
- Indústria Gamma
- Tech Solutions
- Delta Engenharia

### 🏭 Fornecedores (5)
- Materiais São Paulo LTDA
- Eletrônicos Tech LTDA
- Móveis Corporativos Ltda
- Higiene & Limpeza Distribuidora
- Ferramentas & Equipamentos SA

### 📋 Projetos (5)
- Sistema de Gestão Empresarial
- Automação Industrial IoT
- Aplicativo Mobile E-commerce
- Infraestrutura de Rede Empresarial
- Sistema de Monitoramento Ambiental

### 📦 Itens (7+ itens por categoria)
- **Tecnologia**: Notebooks, Monitores, Impressoras
- **Móveis**: Mesas, Cadeiras, Armários
- **Ferramentas**: Furadeiras, Parafusadeiras
- **Materiais**: Cimento, Brita, Ferro
- **Limpeza**: Detergentes, Álcool, Produtos diversos

## 📄 Arquivos XML de Teste

O projeto inclui 6 arquivos XML de exemplo:

1. **nf_entrada_materiais_construcao.xml** - Materiais de construção (ENTRADA)
2. **nf_saida_equipamentos.xml** - Equipamentos (SAÍDA)
3. **nf_entrada_eletronicos.xml** - Eletrônicos (ENTRADA)
4. **nf_entrada_moveis_escritorio.xml** - Móveis (ENTRADA)
5. **nf_saida_material_escritorio.xml** - Material de escritório (SAÍDA)
6. **nf_entrada_produtos_limpeza.xml** - Produtos de limpeza (ENTRADA)

### Importando XMLs

Para processar os XMLs e criar produtos/movimentações:

1. **Via Interface Web** (Recomendado):
   ```bash
   make import-xml  # Mostra instruções e abre navegador
   ```
   - Acesse http://localhost:3000/produtos/form
   - Faça upload de cada XML
   - Preencha projeto e fornecedor
   - Salve os produtos

2. **Via Script** (Apenas upload para S3):
   ```bash
   npm run upload-xmls
   ```

## 🔧 Pré-requisitos

- Node.js 18+
- NPM ou Yarn
- Banco de dados MySQL configurado
- Variáveis de ambiente configuradas

## 📝 Variáveis de Ambiente

Certifique-se de ter um arquivo `.env` com:

```env
DATABASE_URL="mysql://user:password@localhost:3306/gestao_estoque"
NEXTAUTH_SECRET="your-secret-key"
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="your-bucket-name"
```

## 🐛 Solução de Problemas

### Servidor não está rodando
```bash
# Verifique se o servidor está ativo
make status

# Se não estiver, inicie em outro terminal
make dev
```

### Erro de conexão com banco
```bash
# Verifique se as migrações estão atualizadas
make migrate

# Se necessário, reset completo (CUIDADO!)
make reset-db
```

### Dados já existem
```bash
# Para recriar dados, reset o banco primeiro
make reset-db
make populate-db
```

## 📈 Fluxo de Desenvolvimento

1. **Setup inicial**:
   ```bash
   make full-setup
   ```

2. **Desenvolvimento diário**:
   ```bash
   make dev           # Terminal 1
   make populate-db   # Terminal 2 (quando necessário)
   ```

3. **Reset completo** (quando necessário):
   ```bash
   make clean
   make full-setup
   make populate-db
   ```

## 🎯 Próximos Passos

Após a população do banco:

1. ✅ Acesse http://localhost:3000
2. ✅ Teste as funcionalidades básicas
3. ✅ Importe os XMLs via interface
4. ✅ Verifique movimentações de estoque
5. ✅ Teste criação de novos registros

---

## 🤝 Contribuindo

Para adicionar novos dados de teste:

1. Edite `scripts/populate-db.js`
2. Adicione novos arrays de dados
3. Implemente as funções de criação
4. Teste com `make populate-db`

---

**💡 Dica**: Use `make help` sempre que precisar relembrar os comandos disponíveis!
