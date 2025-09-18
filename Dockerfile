FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

# Instala dependências
COPY package*.json ./
# Se você NÃO tem package-lock.json, use:
# RUN npm install --omit=dev
RUN npm ci --omit=dev

# Copia o resto
COPY . .

# Porta padrão (ajuste se necessário)
EXPOSE 3000

# Healthcheck sem curl/wget
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "require('http').get('http://localhost:3000/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

# Usuário não-root já existe na imagem
USER node

# Preferir script start
# No package.json tenha: "start": "node src/index.js"
CMD ["npm", "start"]
