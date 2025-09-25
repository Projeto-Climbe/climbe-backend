# ---------- BUILD ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Requisitos do Prisma no Alpine
RUN apk add --no-cache openssl libc6-compat

# ⚠️ Não force NODE_ENV=production no builder
# ENV NODE_ENV=production  # <- Removido

# 1) Copia manifests e Prisma (cache melhor)
COPY package*.json ./
COPY prisma ./prisma

# 2) Instala TODAS as deps (inclui dev) e gera Prisma Client
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

# Requisitos do Prisma no Alpine
RUN apk add --no-cache openssl libc6-compat

# Usuário não-root
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# Copia apenas o necessário
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.js ./server.js
COPY package*.json ./

EXPOSE 3000
USER nodejs
CMD ["node", "server.js"]
