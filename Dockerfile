# ---------- 1) BUILD: instala deps + gera Prisma Client ----------
FROM node:20-alpine AS builder
ENV NODE_ENV=production
WORKDIR /app

# Copiamos manifestos e a pasta prisma primeiro p/ cache eficiente
COPY package*.json ./
COPY prisma ./prisma

# Instala TODAS as deps (inclui "prisma" devDependency), gera client e depois remove devDeps
RUN npm ci \
  && npx prisma generate --schema=prisma/schema.prisma \
  && npm prune --omit=dev

# Agora copie o restante do código
COPY src ./src
COPY server.js ./server.js

# ---------- 2) RUNTIME: imagem final, só com o necessário ----------
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Usuário não-root
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# Copia apenas o que precisa para rodar em produção
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.js ./server.js
# (não copie .env; passe variáveis via --env/--env-file)

# Porta padrão do app (ajuste se usar outra)
ENV PORT=3000
EXPOSE 3000

# Healthcheck sem curl/wget
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "require('http').get('http://localhost:${PORT}/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

USER nodejs

# Usa o script do package.json -> "start": "node src/app.js"
CMD ["npm", "start"]
