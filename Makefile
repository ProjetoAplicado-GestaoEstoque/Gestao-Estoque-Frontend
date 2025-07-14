# Makefile para Gestão de Estoque - População do Banco de Dados

.PHONY: help setup clean populate-db dev build test migrate reset-db

# Configurações
NODE_VERSION := 18
DB_NAME := gestao_estoque
API_PORT := 3000

# Cores para output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

help: ## Mostra esta mensagem de ajuda
	@echo "$(GREEN)=== Gestão de Estoque - Comandos Disponíveis ===$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(BLUE)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

setup: ## Instala dependências e configura o projeto
	@echo "$(YELLOW)📦 Instalando dependências...$(NC)"
	npm install
	@echo "$(GREEN)✅ Dependências instaladas!$(NC)"

dev: ## Inicia o servidor de desenvolvimento
	@echo "$(YELLOW)🚀 Iniciando servidor de desenvolvimento...$(NC)"
	npm run dev

build: ## Faz o build do projeto
	@echo "$(YELLOW)🔨 Fazendo build do projeto...$(NC)"
	npm run build

migrate: ## Executa as migrações do Prisma
	@echo "$(YELLOW)🗄️  Executando migrações...$(NC)"
	npx prisma migrate dev
	@echo "$(GREEN)✅ Migrações executadas!$(NC)"

generate: ## Gera o cliente Prisma
	@echo "$(YELLOW)⚡ Gerando cliente Prisma...$(NC)"
	npx prisma generate
	@echo "$(GREEN)✅ Cliente Prisma gerado!$(NC)"

reset-db: ## Reseta o banco de dados (CUIDADO!)
	@echo "$(RED)⚠️  ATENÇÃO: Isso irá apagar todos os dados do banco!$(NC)"
	@read -p "Tem certeza? (y/N) " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "$(YELLOW)🗑️  Resetando banco de dados...$(NC)"
	npx prisma migrate reset --force
	@echo "$(GREEN)✅ Banco resetado!$(NC)"

check-server: ## Verifica se o servidor está rodando
	@echo "$(YELLOW)🔍 Verificando se o servidor está rodando...$(NC)"
	@if curl -f -s http://localhost:$(API_PORT)/ > /dev/null 2>&1; then \
		echo "$(GREEN)✅ Servidor está rodando na porta $(API_PORT)$(NC)"; \
	else \
		echo "$(RED)❌ Servidor não está rodando ou não está respondendo$(NC)"; \
		echo "$(YELLOW)💡 Execute 'make dev' em outro terminal primeiro$(NC)"; \
		exit 1; \
	fi

populate-db: check-server ## Popula o banco de dados com dados de teste
	@echo "$(YELLOW)🌱 Populando banco de dados...$(NC)"
	@if [ ! -f scripts/populate-db.js ]; then \
		echo "$(RED)❌ Arquivo scripts/populate-db.js não encontrado$(NC)"; \
		exit 1; \
	fi
	node scripts/populate-db.js
	@echo "$(GREEN)🎉 Banco de dados populado com sucesso!$(NC)"

import-xml: check-server ## Processa XMLs e cria produtos automaticamente
	@echo "$(YELLOW)📄 Processando XMLs e criando produtos...$(NC)"
	@if [ ! -f scripts/upload-xmls.js ]; then \
		echo "$(RED)❌ Arquivo scripts/upload-xmls.js não encontrado$(NC)"; \
		exit 1; \
	fi
	node scripts/upload-xmls.js
	@echo "$(GREEN)🎉 XMLs processados e produtos criados com sucesso!$(NC)"

import-xml-manual: ## Mostra instruções para importação manual via interface
	@echo "$(YELLOW)📄 Para importar os XMLs manualmente, acesse:$(NC)"
	@echo "$(BLUE)http://localhost:$(API_PORT)/produtos/form$(NC)"
	@echo ""
	@echo "$(YELLOW)📁 Arquivos XML disponíveis:$(NC)"
	@ls -1 *.xml 2>/dev/null | sed 's/^/  - /' || echo "  Nenhum arquivo XML encontrado"

clean: ## Remove node_modules e arquivos temporários
	@echo "$(YELLOW)🧹 Limpando arquivos temporários...$(NC)"
	rm -rf node_modules
	rm -rf .next
	rm -rf dist
	@echo "$(GREEN)✅ Limpeza concluída!$(NC)"

full-setup: setup migrate generate ## Configuração completa do projeto
	@echo "$(GREEN)🎉 Configuração completa finalizada!$(NC)"
	@echo "$(YELLOW)💡 Próximos passos:$(NC)"
	@echo "  1. Execute 'make dev' para iniciar o servidor"
	@echo "  2. Execute 'make populate-db' para popular o banco"
	@echo "  3. Execute 'make import-xml' para processar XMLs"
	@echo "  4. Acesse http://localhost:$(API_PORT)"

populate-all: check-server populate-db import-xml ## Popula banco e processa XMLs automaticamente
	@echo "$(GREEN)🎉 População completa finalizada!$(NC)"
	@echo "$(YELLOW)📊 Sistema totalmente populado com:$(NC)"
	@echo "  - Usuários, clientes, fornecedores e projetos"
	@echo "  - Produtos extraídos dos XMLs"
	@echo "  - Movimentações de estoque criadas"
	@echo "  - Documentos salvos no S3"

status: ## Mostra o status do projeto
	@echo "$(GREEN)=== Status do Projeto ===$(NC)"
	@echo "$(YELLOW)Node.js:$(NC) $$(node --version 2>/dev/null || echo 'Não instalado')"
	@echo "$(YELLOW)NPM:$(NC) $$(npm --version 2>/dev/null || echo 'Não instalado')"
	@echo "$(YELLOW)Prisma:$(NC) $$(npx prisma --version 2>/dev/null | head -1 || echo 'Não instalado')"
	@echo ""
	@echo "$(YELLOW)Dependências:$(NC) $$([ -d node_modules ] && echo 'Instaladas' || echo 'Não instaladas')"
	@echo "$(YELLOW)Build:$(NC) $$([ -d .next ] && echo 'Realizado' || echo 'Não realizado')"
	@echo ""
	@if curl -f -s http://localhost:$(API_PORT) > /dev/null 2>&1; then \
		echo "$(YELLOW)Servidor:$(NC) $(GREEN)Rodando na porta $(API_PORT)$(NC)"; \
	else \
		echo "$(YELLOW)Servidor:$(NC) $(RED)Não está rodando$(NC)"; \
	fi

logs: ## Mostra logs do desenvolvimento
	@echo "$(YELLOW)📋 Para ver logs em tempo real, execute:$(NC)"
	@echo "$(BLUE)make dev$(NC)"

quick-start: ## Início rápido - setup completo + população
	@echo "$(GREEN)🚀 Início Rápido - Gestão de Estoque$(NC)"
	@echo ""
	make full-setup
	@echo ""
	@echo "$(YELLOW)Aguarde o servidor inicializar e execute em outro terminal:$(NC)"
	@echo "$(BLUE)make populate-all$(NC)"
	@echo ""
	@echo "$(YELLOW)Ou execute separadamente:$(NC)"
	@echo "$(BLUE)make populate-db    # Popula banco básico$(NC)"
	@echo "$(BLUE)make import-xml     # Processa XMLs e cria produtos$(NC)"

# Comandos avançados

backup-db: ## Faz backup do banco de dados (apenas estrutura)
	@echo "$(YELLOW)💾 Fazendo backup da estrutura do banco...$(NC)"
	npx prisma db pull
	@echo "$(GREEN)✅ Backup da estrutura salvo em schema.prisma$(NC)"

seed: populate-db ## Alias para populate-db

test: ## Executa testes (se configurados)
	@echo "$(YELLOW)🧪 Executando testes...$(NC)"
	npm test 2>/dev/null || echo "$(YELLOW)⚠️  Testes não configurados ainda$(NC)"

docker-up: ## Sobe containers Docker (se configurado)
	@echo "$(YELLOW)🐳 Subindo containers Docker...$(NC)"
	@if [ -f docker-compose.yaml ]; then \
		docker-compose up -d; \
		echo "$(GREEN)✅ Containers iniciados!$(NC)"; \
	else \
		echo "$(RED)❌ docker-compose.yaml não encontrado$(NC)"; \
	fi

docker-down: ## Derruba containers Docker
	@echo "$(YELLOW)🐳 Parando containers Docker...$(NC)"
	@if [ -f docker-compose.yaml ]; then \
		docker-compose down; \
		echo "$(GREEN)✅ Containers parados!$(NC)"; \
	else \
		echo "$(RED)❌ docker-compose.yaml não encontrado$(NC)"; \
	fi

# Meta target
all: full-setup populate-db ## Executa setup completo e popula banco

.DEFAULT_GOAL := help
