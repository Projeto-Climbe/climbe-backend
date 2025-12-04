# Backend Climbe Investimentos

API REST em Node.js utilizada pelo sistema de gestão da Climbe, com módulos de autenticação, agenda, documentos, propostas e operações financeiras. O serviço é organizado em camadas (controllers, services, models) e expõe rotas autenticadas com JWT/OAuth, integrações com MinIO, Google OAuth, envio de e-mails e documentação OpenAPI.

## Recursos principais
- **Autenticação e autorização**: cadastros tradicionais e via Google OAuth, verificação de status, roles, permissões e notificações de aprovação.
- **Gestão de empresas e representantes**: CRUD de empresas, representantes e serviços vinculados (BPO, M&A, CFO etc.).
- **Agenda, reuniões e notifications**: agendamento com participantes, salas, e-mail de convite e notificações no sistema.
- **Fluxo comercial**: propostas → contratos → planilhas, relatórios e contratos gerenciados com referências Prisma.
- **Gestão documental**: upload e validação de documentos com armazenamento em MinIO.
- **Planilhas Google e relatórios**: referências para integração com Google Sheets, relatórios em PDF e controle de acesso.
- **Documentação viva**: todos os endpoints descritos em OpenAPI (`src/docs/*.yaml`) e servidos em `/api-docs`.

## Tecnologias
- Node.js 20 (ESM) + Express
- Prisma ORM + MySQL
- Swagger/OpenAPI (swagger-jsdoc + swagger-ui-express)
- Google OAuth 2.0 (google-auth-library)
- Autenticação JWT, envio de e-mails com Nodemailer
- Uploads em MinIO via SDK `minio`
- Docker multi-stage + Docker Compose (MySQL)

## Como executar
1. **Pré-requisitos**: [Node.js 20+](https://nodejs.org/), MySQL (local ou via `docker compose`), MinIO (se usar uploads locais).
2. **Instale as dependências**:
   ```bash
   npm install
   ```
3. **Configure o banco e o ambiente**: preencha as variáveis abaixo em um `.env`.
4. **Primeira carga do banco**:
   ```bash
   npm run prisma:generate
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
5. **Executar localmente**:
   - Desenvolvimento com reload automático: `npm run dev`
   - Produção local: `npm start`

### Docker
- Suba o MySQL com `docker compose up -d` (serviço `mysql-climbe`).
- Para montar a imagem do backend: `docker build -t climbe-backend .`
- O container final expõe a porta `3000`.

## Documentação da API
A documentação OpenAPI gerada a partir dos arquivos `src/docs/*.yaml` está disponível em `http://localhost:3000/api-docs`. Use-a como referência de payloads, parâmetros e respostas esperadas de cada rota (usuario, auth, empresa, contratos, planilhas etc.).

## Estrutura do projeto
- `src/routes`: define todas as rotas (usuário, auth, documentos, reuniões, propostas, notificações, planilhas, relatórios, agenda etc.).
- `src/controller`: camada HTTP que valida requisições, chama services e trata respostas.
- `src/service`: lógica de negócio central (autenticação, invitations, uploads, relatórios, planilhas, contratos, notificações, reuniões, empresa e roles).
- `src/model`: queries especializadas com Prisma para cada entidade.
- `src/middleware`: autenticação JWT e middleware de upload (`multer`).
- `src/storage`: clientes e helpers para subir arquivos no MinIO.
- `src/config`: conexão com o banco (`db.js`) e configuração do Swagger.
- `src/mailer.js`: envio de approval, rejection, senha temporária e convites por e-mail.
- `src/docs`: especificações OpenAPI em YAML usadas pelo Swagger.