# ---------- Base de deps (aproveita cache) ----------
FROM node:20-alpine AS deps
WORKDIR /app
# Escolha SÓ um lockfile; copie o correspondente:
COPY package*.json ./
# COPY pnpm-lock.yaml ./
# COPY yarn.lock ./
RUN npm ci --omit=dev

# ---------- Build (compila TS) ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src ./src
# Se usa Prisma:
# COPY prisma ./prisma
# RUN npx prisma generate
RUN npm run start

# ---------- Runtime (imagem final, leve) ----------
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Usuário não-root
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# Copia apenas o necessário
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Se usa Prisma (client precisa em runtime):
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# COPY prisma ./prisma

# Porta da sua API (ajuste se não for 3000)
EXPOSE 3000

# Healthcheck simples (ajuste URL)
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3000/health || exit 1

USER nodejs

# Se seu start é "node dist/index.js"
CMD ["node", "dist/index.js"]
