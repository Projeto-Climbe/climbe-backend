# ---------- BUILD ----------
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production

# 1) Copia manifests e Prisma (melhor cache)
COPY package*.json ./
COPY prisma ./prisma

# 2) Instala deps e gera Prisma Client
RUN npm ci \
  && npx prisma generate --schema=prisma/schema.prisma

# 3) Copia o código da aplicação
COPY src ./src
COPY server.js ./server.js

# 4) Remove devDeps para produção
RUN npm prune --omit=dev

# ---------- RUNTIME ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Usuário não-root
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# Copia apenas o necessário
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.js ./server.js
# IMPORTANTE: copiar package.json para evitar erro do npm (se usar npm start)
COPY package*.json ./

EXPOSE 3000
USER nodejs

# Inicie pelo server.js (ele deve fazer o app.listen)
CMD ["node", "server.js"]
