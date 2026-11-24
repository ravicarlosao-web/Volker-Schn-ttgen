# Deploy na Vercel — Volker Schnüttgen

Guia completo de implantação faseada na **Vercel** (conectado via **GitHub**) até a ativação do domínio definitivo **`https://volker-schnuettgen.com`**.

---

## 1. Arquitetura Escolhida

- **Frontend estático na CDN da Vercel**: `vite build` gera os bundles JS/CSS e imagens em `dist/`. O script `npm run vercel-build` renomeia `dist/index.html` para `dist/_index.html`.
- **Express em uma única Vercel Function (`api/index.ts` → `server.ts`)**:
  - Por que renomear para `dist/_index.html`? Na Vercel, se existir um arquivo estático `dist/index.html` na pasta de saída, a CDN o serve diretamente em `/` antes dos `rewrites`. Ao movê-lo para `dist/_index.html` e incluí-lo via `includeFiles` em `vercel.json`, as rotas `/`, a rota privada do painel (`/atelier-vs-7k9m2x`), deep-links (`/?work=...`, `/?lang=pt`, etc.), `/api/*`, `/robots.txt`, `/sitemap.xml`, `/llms.txt` e `/llms-full.txt` passam pela função Express para receber as metatags dinâmicas de SEO/GEO, enquanto `/assets/*` e `/src/assets/*` continuam servidos diretamente pela CDN com cache longo.
- **Uploads diretos assinados para Cloudinary**: a Vercel impõe teto de **4,5 MB** no corpo das requisições para Serverless Functions, enquanto o painel administrativo aceita imagens até **5 MB**. Por isso, o navegador pede uma assinatura ao servidor (`POST /api/admin/upload/sign`), envia o arquivo diretamente ao Cloudinary e confirma a URL em `POST /api/admin/upload/verify`, sem gravar em disco.

---

## 2. Como Importar do GitHub e Build Settings na Vercel

1. Envie as alterações para o seu repositório no GitHub.
2. Na Vercel, clique em **Add New → Project** e importe o repositório.
3. Em **Build and Output Settings** (o `vercel.json` já define a maior parte automaticamente):
   - **Framework Preset**: `Other` (ou mantenha `Vite` com override abaixo; o `vercel.json` sobrescreve o build).
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install` (padrão)
   - **Node.js Version**: `22.x` (já fixado em `package.json` → `"engines": { "node": "22.x" }`).
4. Clique em **Deploy** inicialmente **sem configurar Turso nem Cloudinary** (Fase 1).

---

## 3. Variáveis de Ambiente por Fase

Configure em **Vercel → Project Settings → Environment Variables** (marque `Production` e, se desejar testar previews, `Preview`):

| Fase | Variável | Obrigatória na Fase? | Onde fica / Tipo | Para que serve |
| --- | --- | --- | --- | --- |
| **Fase 1** (Site público sem BD/Upload) | `NODE_ENV` | Automática na Vercel | Servidor | Define ambiente de produção (`production`). |
| **Fase 1** | `APP_URL` | Opcional na Fase 1 / Obrigatória na Fase 5 | Servidor (pública) | Base canônica de SEO (`https://seu-projeto.vercel.app` na Fase 1, ou omita para auto-detecção; na Fase 5 defina `https://volker-schnuettgen.com`). |
| **Fase 2** (Banco Turso) | `TURSO_DATABASE_URL` | Sim (Fase 2+) | Servidor (**Secreta**) | URL `libsql://...` do banco no Turso. |
| **Fase 2** | `TURSO_AUTH_TOKEN` | Sim (Fase 2+) | Servidor (**Secreta**) | Token de autenticação do banco Turso. |
| **Fase 3** (Uploads Cloudinary) | `CLOUDINARY_CLOUD_NAME` | Sim (Fase 3+) | Servidor | Nome do Cloud no Cloudinary; também retornado na assinatura pública de upload e validado no servidor. |
| **Fase 3** | `CLOUDINARY_API_KEY` | Sim (Fase 3+) | Servidor | Chave pública de API da conta Cloudinary. |
| **Fase 3** | `CLOUDINARY_API_SECRET` | Sim (Fase 3+) | Servidor (**Secreta**) | Segredo usado apenas no backend para assinar uploads diretos. Nunca vai ao navegador. |
| **Fase 4** (Login Admin) | `SESSION_SECRET` | Sim (Fase 4+) | Servidor (**Secreta**) | Chave aleatória longa (mín. 32 caracteres) para assinar tokens Bearer do painel. Sem ela, apenas o login administrativo fica desativado. |
| **Fase 4** | `ADMIN_PASSCODE` | Sim (Fase 4+) | Servidor (**Secreta**) | Senha mestra de acesso ao painel. Em produção o endpoint de setup inicial permanece desativado para impedir tomada de conta. |
| **Fase 4 (Opcional)** | `ADMIN_PATH` e `VITE_ADMIN_PATH` | Não | Servidor + Build | Permite personalizar a URL secreta do painel (use o mesmo valor em ambas; padrão: `/atelier-vs-7k9m2x`). |

> Sempre que adicionar ou alterar variáveis de ambiente na Vercel, faça um **Redeploy** do último deployment para que a função serverless receba os novos valores.

---

## 4. O que acontece na 1ª ligação do Turso (Fase 2)

1. Assim que `TURSO_DATABASE_URL` e `TURSO_AUTH_TOKEN` estiverem configuradas e você fizer **Redeploy**, a primeira requisição que consultar o banco executará `initDatabase()` **uma única vez por instância** (controlado por promise memoizada `initPromise`).
2. `initDatabase()` cria de forma idempotente (`CREATE TABLE IF NOT EXISTS`) as 7 tabelas:
   - `site_settings`, `portfolio_categories`, `projects`, `journal_entries`, `enquiries`, `admin_credentials`, `login_attempts`.
3. Em seguida, se `portfolio_categories`, `projects` ou `journal_entries` estiverem vazias, insere automaticamente os dados iniciais do estúdio com `INSERT OR IGNORE` (sem duplicar dados caso duas instâncias iniciem simultaneamente).
4. **Como confirmar que as tabelas foram criadas**:
   - No terminal local com Turso CLI:
     ```bash
     turso db shell SEU-BANCO ".tables"
     turso db shell SEU-BANCO "SELECT COUNT(*) FROM projects;"
     ```
   - Ou pelo painel web do Turso (**Database → Data / Tables**), verificando as 7 tabelas preenchidas e consultando `GET /api/health` (`"turso": "configured"`).

---

## 5. Checklist de Testes por Fases

### Fase 1 — Sem Turso, sem Cloudinary e sem segredos Admin
> Objetivo: validar CDN, função Express, roteamento, idiomas, SEO/GEO e modo somente leitura.

- [ ] **Health check**: Acesse `GET https://SEU-APP.vercel.app/api/health`
  - **Esperado**: HTTP `200`, JSON com `"ok": true`, `"turso": "missing"`, `"cloudinary": "missing"`, `"adminAuth": "missing"`.
- [ ] **Home pública**: Acesse `/`
  - **Esperado**: Abre normalmente com imagem Hero, categorias, obras em destaque e Journal usando os dados padrão.
- [ ] **Troca de idioma**: Teste `/?lang=pt`, `/?lang=de` e o seletor no topo.
  - **Esperado**: Textos mudam entre EN / PT / DE e o `<html lang="...">` acompanha o idioma escolhido.
- [ ] **Filtros e navegação**: Teste `/?portfolio=all` e `/?category=STONE` (ou outra categoria).
  - **Esperado**: Abre a visualização de portfólio/categoria sem erro de console.
- [ ] **Deep link + Refresh (F5)**: Acesse `/?work=livros` (ou abra uma obra e pressione **F5**).
  - **Esperado**: A página recarrega diretamente no detalhe da obra com `<title>` e JSON-LD específicos dessa obra no código-fonte.
- [ ] **Rota legada `/admin` bloqueada**: Acesse `/admin`.
  - **Esperado**: HTTP `404` (`Not found`). O link público do rodapé também foi removido e `/robots.txt` não expõe a rota secreta.
- [ ] **Página privada `/atelier-vs-7k9m2x` e F5**: Acesse `/atelier-vs-7k9m2x` e pressione **F5**.
  - **Esperado**: Abre a tela do painel exibindo aviso de acesso desativado até configurar `SESSION_SECRET` e `ADMIN_PASSCODE` (sem permitir criar senha e sem expor detalhes internos de banco/Cloudinary).
- [ ] **Formulário de contato em modo somente leitura**: Envie uma mensagem pelo formulário Contact no rodapé.
  - **Esperado**: `POST /api/enquiries` responde HTTP `503` com `{"error":"Database not configured"}` e a UI mostra a mensagem amigável sem quebrar a página.
- [ ] **Arquivos de SEO e GEO**: Acesse `/robots.txt`, `/sitemap.xml`, `/llms.txt` e `/llms-full.txt`.
  - **Esperado**: Todos respondem HTTP `200` com `Content-Type` adequado e URLs consistentes.

### Fase 2 — Turso conectado (`TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` + Redeploy)
- [ ] **Health check**: Acesse `/api/health`.
  - **Esperado**: `"turso": "configured"`.
- [ ] **Portfólio via Turso**: Acesse `/` e `/api/portfolio`.
  - **Esperado**: Site abre com dados vindos do Turso e tabelas criadas no painel/CLI do Turso (`SELECT COUNT(*) FROM projects;` > 0).
- [ ] **Envio no formulário Contact**: Preencha e envie uma mensagem real no site público.
  - **Esperado**: HTTP `201` com `{"ok": true, "id": "..."}` e registro salvo na tabela `enquiries` no Turso.

### Fase 3 — Cloudinary conectado (`CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET` + Redeploy)
> Se ainda não ativou a Fase 4, confirme primeiro `/api/health`; se já ativou a Fase 4 junto, faça login em `/atelier-vs-7k9m2x`.
- [ ] **Health check**: Acesse `/api/health`.
  - **Esperado**: `"cloudinary": "configured"`.
- [ ] **Preparação do upload assinado**: Quando autenticado na Fase 4, envie uma imagem JPEG/PNG/WEBP/GIF (até 5 MB) em Hero, Categoria, Obra ou Journal no painel administrativo.
  - **Esperado**: Navegador chama `POST /api/admin/upload/sign`, envia direto para `https://api.cloudinary.com/v1_1/<cloud_name>/image/upload`, valida em `POST /api/admin/upload/verify` e recebe URL `https://res.cloudinary.com/...`.

### Fase 4 — Admin ativo (`SESSION_SECRET` + `ADMIN_PASSCODE` + Redeploy)
- [ ] **Health check**: Acesse `/api/health`.
  - **Esperado**: `"adminAuth": "configured"`.
- [ ] **Setup bloqueado**: Tente `POST /api/admin/auth/setup`.
  - **Esperado**: HTTP `403` (`Initial admin setup is disabled in this environment.`).
- [ ] **Login errado e limite de tentativas**: Tente senha errada em `/atelier-vs-7k9m2x`.
  - **Esperado**: Resposta genérica `401 Invalid credentials.` (após 5 tentativas erradas por IP ou 20 globais em 15 min, responde `429` com bloqueio salvo na tabela `login_attempts` do Turso).
- [ ] **Login correto e CRUD completo**: Entre em `/atelier-vs-7k9m2x` com `ADMIN_PASSCODE`.
  - **Esperado**: Lista a mensagem enviada na Fase 2 na aba Contact Inbox, permite trocar status/excluir, atualizar Hero, criar/editar Categoria, Obra e Journal com upload Cloudinary e ver a alteração refletida no site público após F5 e em `/sitemap.xml` / `/llms.txt`.

### Fase 5 — Domínio próprio `https://volker-schnuettgen.com`
1. Em **Vercel → Project Settings → Domains**, adicione `volker-schnuettgen.com` e `www.volker-schnuettgen.com`.
2. Aponte os registros DNS no seu provedor conforme instruído pela Vercel (registro `A` para o apex e `CNAME` para `www`) e aguarde o certificado SSL emitir.
3. Defina `APP_URL="https://volker-schnuettgen.com"` nas variáveis de ambiente da Vercel e execute **Redeploy**.
- [ ] **Validação final**:
  - **Esperado**: `https://volker-schnuettgen.com` abre com HTTPS válido; `<link rel="canonical">`, `hreflang`, JSON-LD, `/robots.txt`, `/sitemap.xml`, `/llms.txt` e `/llms-full.txt` apontam todos para `https://volker-schnuettgen.com`.

---

## 6. Limitações e Pontos de Atenção

- **Limite de 4,5 MB na Vercel**: resolvido com upload direto assinado para o Cloudinary; por isso, imagens enviadas pelo painel administrativo nunca passam pelo corpo da função Express.
- **Formulário de contato**: as mensagens continuam sendo gravadas na tabela `enquiries` do Turso e exibidas no painel administrativo (o projeto não possui envio de e-mail SMTP/Resend configurado).
- **Rate limit de login sem Turso**: quando o Turso ainda não está conectado, o contador de tentativas fica apenas na memória da instância serverless (efêmero entre invocações); com o Turso conectado, o bloqueio é persistido na tabela `login_attempts`.
