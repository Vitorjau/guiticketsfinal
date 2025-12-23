# GuiTickets - Deployment Guide
# Render + Vercel + Neon

## Passo 1: Criar Repositório GitHub

1. Acesse https://github.com/new
2. Nome: `guitickets`
3. Descrição: "Aplicação de tickets com Kanban"
4. Visibilidade: Public (mais fácil para Vercel/Render)
5. Crie o repositório

## Passo 2: Fazer Push do Código

Na pasta raiz do projeto:

```bash
git init
git add .
git commit -m "Initial commit: Backend + Frontend MVP"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/guitickets.git
git push -u origin main
```

## Passo 3: Criar Banco de Dados no Neon

1. Acesse https://console.neon.tech (registre-se grátis)
2. Crie um novo projeto chamado "guitickets"
3. Escolha region mais próxima (Brasil = São Paulo se disponível)
4. Crie um banco chamado "guitickets"
5. Copie a **Connection String** (vai parecer assim):
   ```
   postgresql://neondb_owner:senha@ep-xyz.us-east-1.aws.neon.tech/guitickets?sslmode=require
   ```
6. **Importante**: salve essa string, vamos usar no Render

## Passo 4: Deploy Backend no Render

1. Acesse https://render.com (registre com GitHub é mais fácil)
2. Dashboard → **New +** → **Web Service**
3. Conecte seu repositório GitHub (guitickets)
4. **Name**: `guitickets-backend`
5. **Root Directory**: `Back-end` (se perguntado)
6. **Build Command**:
   ```
   npm install && npm run prisma:generate && npm run build
   ```
7. **Start Command**:
   ```
   npm run start:prod
   ```
8. **Plan**: Free (ou pago se quiser mais poder)
9. **Environment Variables**:
   - KEY: `DATABASE_URL`
     VALUE: `cole aqui a string do Neon`
   - KEY: `PORT`
     VALUE: `3001`
   - KEY: `CORS_ORIGIN`
     VALUE: `https://guitickets.vercel.app,http://localhost:5173`
   - KEY: `NODE_ENV`
     VALUE: `production`

10. **Deploy** → Aguarde (vai levar 2-5 minutos)
11. Ao terminar, você terá uma URL como:
    ```
    https://guitickets-backend.onrender.com
    ```
    **Salve essa URL!**

## Passo 5: Rodar Seed no Banco (Produção)

Após o primeiro deploy suceder, execute o seed:

1. No Render, vá em **Shell** (aba inferior do painel do serviço)
2. Execute:
   ```bash
   npm run prisma:migrate deploy
   npm run seed
   ```
3. Se der erro de permissão, tente:
   ```bash
   npx prisma db push
   npm run seed
   ```

Ou faça localmente:
```bash
# No seu computador, back-end
export DATABASE_URL="postgresql://neondb_owner:senha@ep-xyz.us-east-1.aws.neon.tech/guitickets?sslmode=require"
npm run db:push
npm run seed
```

## Passo 6: Deploy Frontend no Vercel

1. Acesse https://vercel.com (registre com GitHub)
2. **Import Project** → selecione `guitickets`
3. **Framework Preset**: Vite (Vercel detecta automaticamente)
4. **Root Directory**: `Front-end`
5. **Build Command**: `npm run build` (padrão)
6. **Output Directory**: `dist` (padrão)
7. **Environment Variables**:
   - KEY: `VITE_API_URL`
     VALUE: `https://guitickets-backend.onrender.com`
8. **Deploy** → Aguarde (geralmente < 1 minuto)
9. Você terá uma URL como:
   ```
   https://guitickets.vercel.app
   ```

## Passo 7: Verificar CORS

Após ambos os deploys, atualize o CORS do backend:

1. No Render, vá em **Settings** → **Environment**
2. Edite `CORS_ORIGIN`:
   ```
   https://guitickets.vercel.app
   ```
3. **Redeploy** (o Render detecta mudanças e reconstrói)

## Passo 8: Testes na Nuvem

1. Abra https://guitickets.vercel.app
2. Health check backend: abra o console do navegador
3. Teste:
   - Registre um usuário requester
   - Registre um agente com código
   - Login ambos
   - Atualize perfil
   - Crie ticket/tarefa
4. Verifique dados no banco (Neon Console)

## Passo 9: Domínio Customizado (Opcional)

### Frontend (Vercel)
1. Vercel → Project → Settings → Domains
2. Adicione seu domínio (ex.: guitickets.com.br)
3. Configure DNS no provedor do domínio

### Backend (Render)
1. Render → Service → Settings → Custom Domain
2. Adicione seu domínio (ex.: api.guitickets.com.br)
3. Configure DNS

## Custo Mensal Estimado

| Serviço | Tier | Custo |
|---------|------|-------|
| Neon | Free (0.5GB) | R$0 |
| Render | Free | R$0 (750h/mês) |
| Vercel | Free | R$0 (100GB BW) |
| **Total** | | **R$0** |

Após crescimento (< R$50/mês para cada pagarás conforme uso).

## Troubleshooting

### "CORS error no browser"
- Verifique `CORS_ORIGIN` no Render
- Aguarde redeploy do backend (~30s)

### "Database connection refused"
- Verifique string `DATABASE_URL` está correta (copy-paste do Neon)
- Verifique database existe no Neon console

### "Frontend não vê backend"
- Verifique `VITE_API_URL` no .env.production
- Rebuild frontend no Vercel (Settings → Deployments → Redeploy)

### Build falha no Render
- Verifique logs (View Logs no Render dashboard)
- Certifique que Build Command inclui `npm run prisma:generate`
- Cheque se PORT está definido nas env vars

## Dicas

1. **Antes de fazer push**: teste localmente que tudo funciona
2. **Valores sensíveis**: nunca commit .env real, use .env.example
3. **Database migrations**: sempre rode `npm run db:push` antes de seed em produção
4. **Logs**: use Render/Vercel dashboards para debugar
5. **Redeploys**: a maioria dos ajustes de env var requer redeploy

---

Dúvidas? Verifique os dashboards de cada serviço (Neon, Render, Vercel).
