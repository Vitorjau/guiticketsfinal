# GuiTickets - Documentação Técnica Completa

**Versão**: 1.0.0  
**Data**: 23 de Dezembro de 2025  
**Status**: Produção

---

## 📋 Índice

1. [Visão de Produto (Product Owner)](#1-visão-de-produto-product-owner)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Estrutura do Projeto](#3-estrutura-do-projeto)
4. [Funcionalidades Implementadas](#4-funcionalidades-implementadas)
5. [Guia de Testes](#5-guia-de-testes)
6. [Deploy e Infraestrutura](#6-deploy-e-infraestrutura)
7. [Configuração e Variáveis de Ambiente](#7-configuração-e-variáveis-de-ambiente)
8. [APIs e Endpoints](#8-apis-e-endpoints)
9. [Modelos de Dados](#9-modelos-de-dados)
10. [Segurança e Autenticação](#10-segurança-e-autenticação)
11. [Limitações Conhecidas](#11-limitações-conhecidas)
12. [Roadmap Futuro](#12-roadmap-futuro)

---

## 1. Visão de Produto (Product Owner)

### 1.1. Objetivo do Produto

**GuiTickets** é um sistema de gerenciamento de tickets/chamados desenvolvido para facilitar a comunicação entre solicitantes (requesters) e agentes de suporte. O sistema permite:

- **Solicitantes** criarem e acompanharem seus chamados
- **Agentes** gerenciarem tickets através de um quadro Kanban
- **Administradores** controlarem o acesso através de códigos de convite

### 1.2. Problema Resolvido

Empresas e equipes de TI precisam de uma forma organizada de:
- Receber e categorizar solicitações de usuários
- Atribuir responsáveis para cada chamado
- Acompanhar o progresso de resolução
- Manter histórico de comunicação
- Visualizar status em tempo real

### 1.3. Público-Alvo

- **Solicitantes (Requesters)**: Usuários finais que precisam de suporte
- **Agentes**: Membros da equipe de suporte/TI que resolvem chamados
- **Gestores**: Acompanham métricas e distribuição de trabalho

### 1.4. Diferenciais

1. **Sistema de códigos de agente**: Controle de acesso seguro para novos membros da equipe
2. **Domínio restrito para agentes**: Apenas emails @agente.com podem se registrar como agentes
3. **Kanban integrado**: Visualização clara de tarefas técnicas separadas de tickets
4. **Grupos de atribuição**: Organização por departamentos (TI, RH, Financeiro, etc.)
5. **Sistema de prioridades**: 4 níveis (Low, Medium, High, Urgent)

### 1.5. Métricas de Sucesso

- Tempo médio de resolução de tickets
- Taxa de reaberturas de chamados
- Número de tickets por agente
- Distribuição de prioridades
- Satisfação do usuário (a implementar)

---

## 2. Arquitetura do Sistema

### 2.1. Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                    (React + Vite)                           │
│              https://guitickets.vercel.app                  │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS REST API
                     │
┌────────────────────▼────────────────────────────────────────┐
│                         Backend                             │
│                    (NestJS + Prisma)                        │
│            https://guitickets.onrender.com                  │
└────────────────────┬────────────────────────────────────────┘
                     │ PostgreSQL
                     │
┌────────────────────▼────────────────────────────────────────┐
│                        Database                             │
│                  (PostgreSQL 17 - Neon)                     │
│              Neon Serverless Database                       │
└─────────────────────────────────────────────────────────────┘
```

### 2.2. Stack Tecnológico

#### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.3
- **Linguagem**: TypeScript 5.6.2
- **UI Components**: Radix UI (@radix-ui/react-*)
- **Styling**: Emotion (@emotion/styled, @emotion/react)
- **Notificações**: Sonner (toasts)
- **HTTP Client**: Fetch API nativo

#### Backend
- **Framework**: NestJS 11.0.1
- **Runtime**: Node.js 22.16.0
- **Linguagem**: TypeScript 5.6.2
- **ORM**: Prisma 6.19.1
- **Validação**: class-validator 0.14.1, class-transformer 0.5.1
- **Configuração**: @nestjs/config 4.0.0

#### Database
- **SGBD**: PostgreSQL 17 (Neon Serverless)
- **Região**: sa-east-1 (São Paulo, Brasil)
- **Schema Management**: Prisma Migrate

### 2.3. Padrões Arquiteturais

#### Frontend
- **Padrão**: Componentes funcionais com hooks
- **Estado**: Gerenciamento local via useState/useCallback
- **Rotas**: Navegação por estado (currentPage)
- **API**: Camada de abstração em `api/client.ts`

#### Backend
- **Padrão**: Modular (NestJS Modules)
- **Camadas**:
  - **Controllers**: Rotas HTTP e validação de entrada
  - **Services**: Lógica de negócio
  - **Prisma**: Acesso a dados
- **Injeção de Dependências**: Nativa do NestJS

### 2.4. Fluxo de Dados

```
User Action → Frontend Component → API Client → HTTP Request
                                                      ↓
                                            Backend Controller
                                                      ↓
                                              Service Layer
                                                      ↓
                                             Prisma Client
                                                      ↓
                                          PostgreSQL Database
                                                      ↓
                                              Response JSON
                                                      ↓
                                            Frontend Update
```

---

## 3. Estrutura do Projeto

### 3.1. Backend (`/Back-end`)

```
Back-end/
├── prisma/
│   ├── schema.prisma          # Definição do schema do banco
│   └── sql-ddl.sql            # DDL SQL (referência)
├── src/
│   ├── main.ts                # Entry point da aplicação
│   ├── app.module.ts          # Módulo raiz
│   ├── seed.ts                # Script de seed
│   ├── auth/                  # Autenticação
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── users/                 # Gestão de usuários
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── dto/
│   ├── tickets/               # Sistema de tickets
│   │   ├── tickets.controller.ts
│   │   ├── tickets.service.ts
│   │   ├── tickets.module.ts
│   │   └── dto/
│   ├── tasks/                 # Tarefas Kanban
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   ├── tasks.module.ts
│   │   └── dto/
│   ├── assignment-groups/     # Grupos de atribuição
│   │   ├── assignment-groups.controller.ts
│   │   ├── assignment-groups.service.ts
│   │   ├── assignment-groups.module.ts
│   │   └── dto/
│   ├── invite-codes/          # Validação de códigos
│   │   └── invite-codes.controller.ts
│   ├── prisma/                # Prisma Service
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   └── scripts/
│       └── generate-agent-codes.ts
├── dist/                      # Build output (commitado)
├── package.json
├── tsconfig.json
├── .env                       # Variáveis locais/produção
└── .env.example               # Template de variáveis
```

### 3.2. Frontend (`/Front-end`)

```
Front-end/
├── src/
│   ├── main.tsx               # Entry point
│   └── app/
│       ├── App.tsx            # Componente principal
│       ├── api/
│       │   └── client.ts      # Cliente HTTP
│       ├── components/        # Componentes reutilizáveis
│       │   ├── CreateTicketModal.tsx
│       │   ├── CreateTaskModal.tsx
│       │   ├── TaskDetailModal.tsx
│       │   ├── DashboardLayout.tsx
│       │   ├── ThemeToggle.tsx
│       │   ├── ContextMenu.tsx
│       │   └── ui/            # Componentes UI base
│       ├── pages/             # Páginas da aplicação
│       │   ├── LoginPage.tsx
│       │   ├── RegisterPage.tsx
│       │   ├── ProfilePage.tsx
│       │   ├── KanbanView.tsx
│       │   ├── MyTicketsPage.tsx
│       │   ├── AllTicketsPage.tsx
│       │   └── ...
│       ├── contexts/
│       │   └── ThemeContext.tsx
│       └── styles/
│           ├── index.css
│           ├── tailwind.css
│           ├── theme.css
│           └── fonts.css
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.local                 # Desenvolvimento local
└── .env.production            # Produção
```

---

## 4. Funcionalidades Implementadas

### 4.1. Autenticação e Autorização

#### ✅ Registro de Usuários
- **Solicitantes**: Registro livre com email + senha
- **Agentes**: Requer email @agente.com + código de agente válido
- **Validação**: Email único, senha mínima, código one-time use

#### ✅ Login
- Autenticação por email + senha
- Retorna dados do usuário (id, name, email, role)
- Redirecionamento baseado em role:
  - `requester` → "Meus Chamados"
  - `agent` → "Kanban"

#### ✅ Gestão de Perfil
- Atualização de nome, email, telefone, gênero
- Alteração de senha (com verificação da senha atual)
- Preservação de role após updates (bugfix crítico implementado)

### 4.2. Sistema de Tickets

#### ✅ Criação de Tickets
- Campos: título, descrição, prioridade, sistema relacionado, tags
- Formato ID: `TCK-0001`, `TCK-0002`, etc.
- Autor automaticamente associado
- Status inicial: `OPEN`
- Grupo de atribuição automático baseado em sistema relacionado

#### ✅ Visualização de Tickets
- **Solicitante**: Vê apenas seus próprios tickets
- **Agente**: Vê todos os tickets do sistema
- Filtros por status: Abertos, Em Progresso, Aguardando, Concluídos

#### ✅ Atribuição de Tickets
- Agentes podem atribuir tickets para si ou outros agentes
- Atualiza automaticamente status para `IN_PROGRESS`

#### ✅ Atualização de Status
- Estados: `OPEN`, `IN_PROGRESS`, `WAITING`, `COMPLETED`, `CANCELLED`
- Transições: abrir → em progresso → aguardando → concluído
- Reabertura de tickets concluídos (volta para `OPEN`)

#### ✅ Sistema de Mensagens
- Adicionar mensagens a tickets existentes
- Registro de autor (nome + email + isAgent)
- Histórico completo de comunicação

#### ✅ Anexos (Parcial)
- Schema: modelo `Attachment` (name, size, mimeType, url)
- Frontend: Campo de upload presente
- **Limitação**: Upload real não implementado (apenas preview local)

### 4.3. Sistema de Tarefas (Kanban)

#### ✅ CRUD de Tarefas
- Formato ID: `TASK-0001`, `TASK-0002`, etc.
- Campos: título, descrição, status, prioridade
- Status: `TODO`, `IN_PROGRESS`, `DONE`

#### ✅ Visualização Kanban
- 3 colunas: A Fazer, Em Progresso, Concluído
- Drag-and-drop visual (frontend)
- Atualização de status via API

#### ✅ Diferencial Tarefas vs Tickets
- **Tickets**: Solicitações de usuários finais
- **Tarefas**: Trabalho técnico interno da equipe

### 4.4. Grupos de Atribuição

#### ✅ Grupos Padrão
1. **suporte-ti**: Suporte técnico geral
2. **infraestrutura**: Servidores, rede, hardware
3. **rh**: Recursos humanos
4. **financeiro**: Questões financeiras
5. **geral**: Outros assuntos

#### ✅ CRUD de Grupos
- Criar novos grupos
- Editar nome, cor, descrição
- Associar tickets a grupos
- Key único (slug) para identificação

### 4.5. Códigos de Agente

#### ✅ Sistema de Códigos
- Formato: `AGENT-0001-XXXXXX` (6 caracteres aleatórios)
- One-time use: Cada código usado apenas uma vez
- Rastreamento: Registra userId que usou o código

#### ✅ Geração de Códigos
- Script: `npm run codes:generate`
- Quantidade configurável (padrão: 30 códigos)
- Numeração sequencial automática

#### ✅ Validação
- Endpoint: `GET /invite-codes/:code`
- Retorna: `{code, exists, valid, used, usedBy}`

---

## 5. Guia de Testes

### 5.1. Testes Funcionais (Manual)

#### Cenário 1: Registro e Login

**Teste 1.1 - Registro de Solicitante**
1. Acesse https://guitickets.vercel.app
2. Clique em "Cadastre-se"
3. Preencha:
   - Nome: João Silva
   - Email: joao@teste.com
   - Senha: senha123
4. Clique "Cadastrar"
5. **Resultado Esperado**: Redirecionamento para "Meus Chamados"

**Teste 1.2 - Registro de Agente**
1. Acesse a página de registro
2. Preencha:
   - Nome: Maria Agente
   - Email: maria@agente.com
   - Código: `AGENT-0001-W3J5O0`
   - Senha: senha123
3. Clique "Cadastrar"
4. **Resultado Esperado**: Redirecionamento para "Kanban"

**Teste 1.3 - Tentativa de Registro com Código Inválido**
1. Tente registrar agente com código: `AGENT-9999-INVALID`
2. **Resultado Esperado**: Erro "Código de agente inválido"

**Teste 1.4 - Login**
1. Faça logout
2. Faça login com credenciais cadastradas
3. **Resultado Esperado**: Redirecionamento correto baseado em role

#### Cenário 2: Gestão de Tickets

**Teste 2.1 - Criar Ticket (Solicitante)**
1. Login como solicitante
2. Clique "Novo Chamado"
3. Preencha:
   - Título: Computador não liga
   - Descrição: Ao pressionar o botão power, nada acontece
   - Prioridade: High
   - Sistema: Infraestrutura
4. Clique "Criar"
5. **Resultado Esperado**: Ticket criado com ID `TCK-XXXX`, status `OPEN`

**Teste 2.2 - Visualizar Tickets (Agente)**
1. Login como agente
2. Navegue para "Todos os Chamados"
3. **Resultado Esperado**: Lista de todos os tickets do sistema

**Teste 2.3 - Atribuir Ticket**
1. Login como agente
2. Abra um ticket não atribuído
3. Clique "Atribuir para Mim"
4. **Resultado Esperado**: 
   - Status muda para `IN_PROGRESS`
   - Agente aparece como responsável

**Teste 2.4 - Adicionar Mensagem**
1. Abra um ticket
2. Digite mensagem: "Estou verificando o problema"
3. Clique "Enviar"
4. **Resultado Esperado**: Mensagem aparece no histórico

**Teste 2.5 - Reabrir Ticket**
1. Marque um ticket como "Concluído"
2. Clique "Reabrir"
3. **Resultado Esperado**: Status volta para `OPEN`

#### Cenário 3: Sistema Kanban

**Teste 3.1 - Criar Tarefa**
1. Login como agente
2. Acesse "Kanban"
3. Clique "Nova Tarefa"
4. Preencha:
   - ID: TASK-0050
   - Título: Atualizar servidor de produção
   - Descrição: Instalar patches de segurança
   - Prioridade: High
5. **Resultado Esperado**: Tarefa criada na coluna "A Fazer"

**Teste 3.2 - Mover Tarefa**
1. Selecione uma tarefa
2. Mude status para "Em Progresso"
3. **Resultado Esperado**: Tarefa move para coluna central

**Teste 3.3 - Completar Tarefa**
1. Mude status para "Concluído"
2. **Resultado Esperado**: Tarefa move para última coluna

#### Cenário 4: Perfil de Usuário

**Teste 4.1 - Atualizar Dados Pessoais**
1. Acesse "Perfil"
2. Altere nome para "João Santos"
3. Altere telefone para "(11) 98765-4321"
4. Clique "Salvar"
5. **Resultado Esperado**: Mensagem de sucesso, dados atualizados

**Teste 4.2 - Alterar Senha**
1. Acesse "Perfil"
2. Clique "Alterar Senha"
3. Preencha:
   - Senha atual: senha123
   - Nova senha: novaSenha456
4. Clique "Confirmar"
5. Faça logout e login com nova senha
6. **Resultado Esperado**: Login bem-sucedido

**Teste 4.3 - Preservação de Role**
1. Login como agente
2. Atualize qualquer dado do perfil
3. Faça logout e login novamente
4. **Resultado Esperado**: Ainda redireciona para Kanban (role preservado)

### 5.2. Testes de Integração

#### Teste I1 - Fluxo Completo de Ticket

1. **Setup**: Criar 1 solicitante + 1 agente
2. **Ações**:
   - Solicitante cria ticket
   - Agente visualiza ticket
   - Agente atribui para si
   - Agente adiciona mensagem
   - Solicitante responde mensagem
   - Agente marca como concluído
   - Solicitante reabre ticket
   - Agente resolve novamente
3. **Validações**:
   - Histórico completo de mensagens
   - Mudanças de status corretas
   - Notificações visuais funcionando

#### Teste I2 - Sistema de Códigos

1. **Ação**: Gerar 30 novos códigos
   ```bash
   npm run codes:generate
   ```
2. **Validação**: 
   - Códigos únicos
   - Numeração sequencial
   - Banco atualizado
3. **Ação**: Usar 1 código para registro
4. **Validação**: Código marcado como `used`
5. **Ação**: Tentar reusar mesmo código
6. **Validação**: Rejeição com erro apropriado

### 5.3. Testes de Performance

#### Teste P1 - Cold Start (Render)

1. Aguarde 15min sem acessar o site
2. Acesse https://guitickets.vercel.app
3. Tente fazer login
4. **Métrica**: Tempo até resposta do servidor
5. **Esperado**: ~50 segundos na primeira requisição

#### Teste P2 - Warm Server

1. Com servidor acordado
2. Faça 10 requisições sequenciais (criar tickets, listar, etc.)
3. **Métrica**: Tempo médio de resposta
4. **Esperado**: < 500ms por requisição

### 5.4. Testes de Segurança

#### Teste S1 - Validação de Email de Agente

1. Tente registrar agente com email não-@agente.com
2. **Resultado Esperado**: Rejeição com mensagem clara

#### Teste S2 - One-Time Code

1. Use um código válido para registro
2. Tente usar o mesmo código novamente
3. **Resultado Esperado**: Erro "Código já utilizado"

#### Teste S3 - Acesso a Tickets de Outros Usuários

1. Login como solicitante A
2. Anote ID de um ticket criado
3. Logout e login como solicitante B
4. Tente acessar ticket de A (via URL ou API)
5. **Resultado Esperado**: Apenas visualização, sem edição (implementar validação se necessário)

### 5.5. Testes de Regressão

Após cada deploy, executar:
- ✅ Login de solicitante
- ✅ Login de agente
- ✅ Criar ticket
- ✅ Atribuir ticket
- ✅ Atualizar perfil
- ✅ Alterar senha
- ✅ Criar tarefa Kanban

---

## 6. Deploy e Infraestrutura

### 6.1. Ambientes

| Ambiente   | URL                                    | Propósito         |
|------------|----------------------------------------|-------------------|
| Frontend   | https://guitickets.vercel.app          | Interface do usuário |
| Backend    | https://guitickets.onrender.com        | API REST          |
| Database   | Neon (sa-east-1)                       | PostgreSQL 17     |

### 6.2. Processo de Deploy

#### Frontend (Vercel)

1. **Configuração**:
   - Repositório: GitHub (Vitorjau/guiticketsfinal)
   - Branch: `main`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Deploy**:
   - Push para `main` → Auto-deploy
   - Ou: Redeploy manual via dashboard

3. **Environment Variables**:
   ```
   VITE_API_URL=https://guitickets.onrender.com
   ```

#### Backend (Render)

1. **Configuração**:
   - Repositório: GitHub (Vitorjau/guiticketsfinal)
   - Branch: `main`
   - Runtime: Node.js 22.16.0
   - Build Command: `npm install --omit=dev`
   - Start Command: `npm run start:prod`

2. **Deploy**:
   - Manual via dashboard (após git push)
   - Tempo: ~2-3 minutos

3. **Environment Variables**:
   ```
   DATABASE_URL=postgresql://neondb_owner:***@ep-***.neon.tech/neondb
   PORT=3001
   CORS_ORIGIN=https://guitickets.vercel.app
   NODE_ENV=production
   ```

4. **Observação**: 
   - Prisma client gerado localmente e commitado (`dist/` e `node_modules/.prisma/`)
   - BinaryTargets: `["native", "debian-openssl-3.0.x"]`

#### Database (Neon)

1. **Configuração**:
   - Região: sa-east-1 (São Paulo)
   - PostgreSQL: 17
   - Plano: Free (0.5GB storage, 5GB transfer)

2. **Schema Management**:
   ```bash
   # Local - sync schema
   npm run db:push
   
   # Seed production
   npm run seed
   
   # Generate codes
   npm run codes:generate
   ```

### 6.3. Monitoramento

#### Health Checks

- **Frontend**: Sempre disponível (Vercel)
- **Backend**: Sleep após 15min inatividade
  - Solução: UptimeRobot ping a cada 5min
- **Database**: Sempre disponível (Neon)

#### Logs

- **Vercel**: Dashboard → Deployments → Logs
- **Render**: Dashboard → Logs (real-time)
- **Neon**: Query insights via dashboard

---

## 7. Configuração e Variáveis de Ambiente

### 7.1. Backend (.env)

```bash
# Database
DATABASE_URL="postgresql://neondb_owner:npg_***@ep-misty-sound-acem9wec-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Server
PORT=3001
NODE_ENV=production

# CORS (comma-separated for multiple origins)
CORS_ORIGIN="https://guitickets.vercel.app"
```

### 7.2. Frontend (.env.production)

```bash
# API Base URL
VITE_API_URL=https://guitickets.onrender.com
```

### 7.3. Frontend (.env.local - Desenvolvimento)

```bash
# API Base URL
VITE_API_URL=http://localhost:3001
```

---

## 8. APIs e Endpoints

### 8.1. Autenticação

#### POST /auth/register
**Descrição**: Registra novo usuário  
**Body**:
```json
{
  "name": "João Silva",
  "email": "joao@teste.com",
  "password": "senha123",
  "role": "requester",
  "agentCode": "AGENT-0001-W3J5O0" // Apenas para role=agent
}
```
**Response 201**:
```json
{
  "id": "cm4x7y8z9...",
  "name": "João Silva",
  "email": "joao@teste.com",
  "role": "requester"
}
```

#### POST /auth/login
**Descrição**: Autentica usuário  
**Body**:
```json
{
  "email": "joao@teste.com",
  "password": "senha123"
}
```
**Response 200**:
```json
{
  "id": "cm4x7y8z9...",
  "name": "João Silva",
  "email": "joao@teste.com",
  "role": "requester",
  "gender": "male",
  "phone": "(11) 98765-4321"
}
```

### 8.2. Usuários

#### GET /users
**Descrição**: Lista todos os usuários  
**Response 200**: Array de usuários

#### GET /users/:id
**Descrição**: Busca usuário por ID  
**Response 200**: Objeto usuário

#### PATCH /users/:id/profile
**Descrição**: Atualiza perfil do usuário  
**Body**:
```json
{
  "name": "João Santos",
  "email": "joao@teste.com",
  "phone": "(11) 98765-4321",
  "gender": "male"
}
```

#### PATCH /users/:id/password
**Descrição**: Altera senha do usuário  
**Body**:
```json
{
  "currentPassword": "senha123",
  "newPassword": "novaSenha456"
}
```

### 8.3. Tickets

#### POST /tickets
**Descrição**: Cria novo ticket  
**Body**:
```json
{
  "title": "Computador não liga",
  "description": "Ao pressionar o botão power...",
  "priority": "high",
  "relatedSystem": "Infraestrutura",
  "authorId": "cm4x7y8z9...",
  "assignmentGroupId": "infraestrutura"
}
```
**Response 201**: Ticket criado

#### GET /tickets
**Descrição**: Lista todos os tickets  
**Query Params**:
- `status`: open, in_progress, waiting, completed, cancelled
- `assignedToId`: ID do agente
- `authorId`: ID do solicitante

#### GET /tickets/:id
**Descrição**: Busca ticket por ID  
**Response 200**: Ticket com mensagens, anexos, tags

#### PATCH /tickets/:id
**Descrição**: Atualiza ticket  
**Body**: Campos a atualizar

#### POST /tickets/:id/assign/:userId
**Descrição**: Atribui ticket a um agente

#### POST /tickets/:id/reopen
**Descrição**: Reabre ticket concluído

#### POST /tickets/:id/status
**Descrição**: Atualiza status do ticket  
**Body**:
```json
{
  "status": "completed",
  "completedById": "cm4x7y8z9..."
}
```

#### POST /tickets/:id/messages
**Descrição**: Adiciona mensagem ao ticket  
**Body**:
```json
{
  "authorId": "cm4x7y8z9...",
  "authorName": "João Silva",
  "authorEmail": "joao@teste.com",
  "content": "Problema resolvido!",
  "isAgent": false
}
```

### 8.4. Tarefas (Kanban)

#### POST /tasks
**Descrição**: Cria nova tarefa  
**Body**:
```json
{
  "id": "TASK-0050",
  "title": "Atualizar servidor",
  "description": "Instalar patches...",
  "status": "TODO",
  "priority": "high"
}
```

#### GET /tasks
**Descrição**: Lista todas as tarefas  
**Query Params**: `status=TODO|IN_PROGRESS|DONE`

#### PATCH /tasks/:id
**Descrição**: Atualiza tarefa (ex: mudar status)

#### DELETE /tasks/:id
**Descrição**: Remove tarefa

### 8.5. Grupos de Atribuição

#### POST /assignment-groups
**Descrição**: Cria novo grupo  
**Body**:
```json
{
  "key": "desenvolvimento",
  "name": "Desenvolvimento",
  "color": "#3b82f6",
  "description": "Equipe de desenvolvimento"
}
```

#### GET /assignment-groups
**Descrição**: Lista todos os grupos

#### PATCH /assignment-groups/:id
**Descrição**: Atualiza grupo

#### DELETE /assignment-groups/:id
**Descrição**: Remove grupo

### 8.6. Códigos de Agente

#### GET /invite-codes/:code
**Descrição**: Valida código de agente  
**Response 200**:
```json
{
  "code": "AGENT-0001-W3J5O0",
  "exists": true,
  "valid": true,
  "used": false,
  "usedBy": null
}
```

---

## 9. Modelos de Dados

### 9.1. User

```prisma
model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         Role     @default(REQUESTER)
  gender       String?  // 'male' | 'female' | 'other' | 'prefer-not-say'
  phone        String?
  
  authoredTickets   Ticket[]   @relation("TicketAuthor")
  assignedTickets   Ticket[]   @relation("TicketAssignee")
  completedTickets  Ticket[]   @relation("TicketCompleter")
  messages          TicketMessage[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  REQUESTER
  AGENT
}
```

### 9.2. Ticket

```prisma
model Ticket {
  id          String        @id
  title       String
  description String?
  status      TicketStatus  @default(OPEN)
  priority    TicketPriority?
  relatedSystem String?
  
  author      User?   @relation("TicketAuthor", fields: [authorId], references: [id])
  authorId    String?
  
  assignedTo    User?   @relation("TicketAssignee", fields: [assignedToId], references: [id])
  assignedToId  String?
  
  completedBy   User?   @relation("TicketCompleter", fields: [completedById], references: [id])
  completedById String?
  
  assignmentGroup   AssignmentGroup? @relation(fields: [assignmentGroupId], references: [id])
  assignmentGroupId String?
  
  messages    TicketMessage[]
  attachments Attachment[]
  tags        TicketTag[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  WAITING
  COMPLETED
  CANCELLED
}

enum TicketPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

### 9.3. Task

```prisma
model Task {
  id          String        @id
  title       String
  description String?
  status      TaskStatus    @default(TODO)
  priority    TicketPriority?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}
```

### 9.4. AssignmentGroup

```prisma
model AssignmentGroup {
  id          String  @id @default(cuid())
  key         String  @unique
  name        String
  color       String?
  description String?
  
  tickets     Ticket[]
}
```

### 9.5. AgentCode

```prisma
model AgentCode {
  id        String  @id @default(cuid())
  code      String  @unique
  used      Boolean @default(false)
  usedBy    String? // userId
  createdAt DateTime @default(now())
}
```

### 9.6. TicketMessage

```prisma
model TicketMessage {
  id        String   @id @default(cuid())
  ticket    Ticket   @relation(fields: [ticketId], references: [id])
  ticketId  String
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  String?
  authorName  String
  authorEmail String
  content     String
  isAgent     Boolean @default(false)
  createdAt   DateTime @default(now())
}
```

---

## 10. Segurança e Autenticação

### 10.1. Autenticação Implementada

- ✅ **Registro com validação**: Email único, senha mínima
- ✅ **Login com credenciais**: Email + senha
- ✅ **Validação de domínio**: Apenas @agente.com para agentes
- ✅ **Códigos one-time**: AgentCode usado apenas uma vez

### 10.2. Limitações de Segurança

- ❌ **Sem JWT/tokens**: Autenticação stateless não implementada
- ❌ **Sem bcrypt**: Senhas não hashadas (passwordHash = plain text)
- ❌ **Sem HTTPS local**: Desenvolvimento em HTTP
- ❌ **Sem rate limiting**: API aberta para múltiplas requisições
- ❌ **Sem RBAC completo**: Validações de permissão básicas

### 10.3. Recomendações para Produção Real

1. **Implementar JWT**:
   ```typescript
   // @nestjs/jwt
   const token = this.jwtService.sign({ sub: user.id, role: user.role });
   ```

2. **Hash de senhas**:
   ```typescript
   // bcrypt
   const hash = await bcrypt.hash(password, 10);
   ```

3. **Middleware de autenticação**:
   ```typescript
   @UseGuards(JwtAuthGuard)
   ```

4. **Rate limiting**:
   ```typescript
   // @nestjs/throttler
   @Throttle({ default: { limit: 10, ttl: 60000 } })
   ```

5. **CORS restritivo**:
   ```typescript
   origin: process.env.CORS_ORIGIN.split(',')
   ```

---

## 11. Limitações Conhecidas

### 11.1. Funcionalidades

1. **Upload de Arquivos**: Campo presente, mas não salva no servidor
2. **Notificações**: Sem notificações em tempo real (implementar WebSocket/SSE)
3. **Pesquisa**: Sem busca textual em tickets/tarefas
4. **Filtros Avançados**: Filtros limitados (status, assignedTo)
5. **Métricas**: Dashboard de métricas não implementado
6. **Histórico de Auditoria**: Sem log de alterações

### 11.2. Performance

1. **Cold Start**: Backend dorme após 15min (Render free)
2. **Sem Paginação**: Todas as listas retornam todos os registros
3. **Sem Cache**: Queries repetidas batem no banco
4. **Sem Índices Otimizados**: Apenas índices padrão do Prisma

### 11.3. Segurança

1. **Senhas em Plain Text**: Não usar bcrypt
2. **Sem JWT**: Autenticação stateless ausente
3. **CORS Amplo**: Aceita qualquer origem em dev
4. **Validação de Input**: Básica (class-validator)

### 11.4. Infraestrutura

1. **Sem CI/CD**: Deploy manual
2. **Sem Testes Automatizados**: Apenas testes manuais
3. **Sem Backup Automático**: Backup manual via Neon dashboard
4. **Logs Limitados**: Logs básicos via console

---

## 12. Roadmap Futuro

### 12.1. Curto Prazo (1-3 meses)

- [ ] **Upload Real de Arquivos**: Integrar Cloudinary/S3
- [ ] **Segurança Completa**: JWT + bcrypt + RBAC
- [ ] **Notificações em Tempo Real**: WebSocket para updates
- [ ] **Pesquisa Global**: Busca textual em tickets/tarefas
- [ ] **Paginação**: Listar tickets/tarefas paginados
- [ ] **Dashboard de Métricas**: Gráficos de performance

### 12.2. Médio Prazo (3-6 meses)

- [ ] **Sistema de Permissões**: RBAC completo (Admin, Supervisor, Agent, User)
- [ ] **SLA (Service Level Agreement)**: Tempo de resposta e resolução
- [ ] **Templates de Tickets**: Modelos pré-configurados
- [ ] **Automações**: Regras de atribuição automática
- [ ] **Integração Email**: Criar tickets via email
- [ ] **Relatórios Avançados**: Exportar PDF/Excel

### 12.3. Longo Prazo (6+ meses)

- [ ] **Multi-tenancy**: Suporte a múltiplas empresas
- [ ] **API Pública**: Webhook e API para integrações
- [ ] **Mobile App**: React Native ou Flutter
- [ ] **IA/ML**: Sugestão automática de prioridade/categoria
- [ ] **Chatbot**: Atendimento automatizado inicial
- [ ] **Base de Conhecimento**: FAQ e artigos de ajuda

---

## 13. Contatos e Suporte

**Repositório**: [github.com/Vitorjau/guiticketsfinal](https://github.com/Vitorjau/guiticketsfinal)  
**Frontend Produção**: [guitickets.vercel.app](https://guitickets.vercel.app)  
**Backend Produção**: [guitickets.onrender.com](https://guitickets.onrender.com)

**Documentação Adicional**:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guia de deploy detalhado
- [AGENT_CODES.md](./Back-end/AGENT_CODES.md) - Lista de códigos de agente
- [README.md](./README.md) - Visão geral do projeto

---

**Versão do Documento**: 1.0.0  
**Última Atualização**: 23 de Dezembro de 2025  
**Autor**: Equipe GuiTickets

---

## 14. CRUDs Simplificados

### 14.1. Conceito
- **Create**: criar um registro novo
- **Read**: listar/buscar registros existentes
- **Update**: atualizar campos de um registro
- **Delete**: remover um registro

### 14.2. Tickets (principal)

- **Create**: `POST /tickets`
  - Campos mínimos: `title`, `description?`, `priority`, `relatedSystem?`, `authorId`
  - Resultado: ticket com `id` no formato `TCK-0001`, `status=OPEN`
  - Exemplo:
    ```json
    {
      "title": "Computador não liga",
      "description": "Ao pressionar o power...",
      "priority": "high",
      "relatedSystem": "infraestrutura",
      "authorId": "<userId>"
    }
    ```

- **Read (lista)**: `GET /tickets`
  - Filtros opcionais: `status`, `assignedToId`, `authorId`
  - Uso comum: agentes listam todos; solicitantes listam os próprios

- **Read (detalhe)**: `GET /tickets/:id`
  - Retorna: ticket + `messages`, `attachments`, `tags`

- **Update**: `PATCH /tickets/:id`
  - Atualiza campos como `title`, `description`, `priority`, `relatedSystem`, `assignmentGroupId`
  - Ações específicas (mantidas como endpoints dedicados):
    - Atribuir: `POST /tickets/:id/assign/:userId` → define responsável e muda `status` para `IN_PROGRESS`
    - Mudar status: `POST /tickets/:id/status` → `OPEN | IN_PROGRESS | WAITING | COMPLETED | CANCELLED`
    - Reabrir: `POST /tickets/:id/reopen` → volta para `OPEN`
    - Mensagem: `POST /tickets/:id/messages` → adiciona comunicação ao histórico

- **Delete**: `DELETE /tickets/:id`
  - Uso raro (auditoria pode preferir cancelar ao invés de deletar)

### 14.3. Usuários

- **Create**: `POST /auth/register` (solicitante) / `POST /auth/register` com `agentCode` (agente)
- **Read**: `GET /users` (lista), `GET /users/:id` (detalhe)
- **Update**: `PATCH /users/:id/profile` (dados pessoais), `PATCH /users/:id/password` (senha)
- **Delete**: `DELETE /users/:id` (admin)

### 14.4. Tarefas (Kanban)

- **Create**: `POST /tasks` (ex.: `id=TASK-0050`, `title`, `status=TODO`)
- **Read**: `GET /tasks` (filtro por `status`)
- **Update**: `PATCH /tasks/:id` (mudar `status`, `title`, `description`, `priority`)
- **Delete**: `DELETE /tasks/:id`

### 14.5. Grupos de Atribuição

- **Create**: `POST /assignment-groups` (ex.: `key`, `name`, `color?`, `description?`)
- **Read**: `GET /assignment-groups`
- **Update**: `PATCH /assignment-groups/:id`
- **Delete**: `DELETE /assignment-groups/:id`

### 14.6. Códigos de Agente

- **Create**: gerados via script `npm run codes:generate` (armazenados em `AgentCode`)
- **Read**: `GET /invite-codes/:code` (validação rápida)
- **Update**: marcado como `used=true` ao registrar um agente
- **Delete**: normalmente não utilizado (manter histórico)
