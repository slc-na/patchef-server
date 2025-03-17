FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine

COPY prisma ./prisma/

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN mkdir -p /mnt/share
EXPOSE 6970

CMD ["sh", "-c", "npm run migrate:deploy && npm run start:prod"]