FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN if [ -d "prisma" ]; then npx prisma generate; fi
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

# Exponemos el puerto del gateway publico
EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
