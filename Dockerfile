FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm dlx prisma generate
RUN pnpm build

FROM node:20-alpine

COPY prisma ./prisma/

RUN npm install -g pnpm

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN mkdir -p /mnt/share

EXPOSE 6970

CMD ["sh", "-c", "mount -t cifs -o username=$RECIPE_REPOSITORY_SERVER_USERNAME,password=$RECIPE_REPOSITORY_SERVER_PASSWORD $RECIPE_REPOSITORY_SERVER_URI $RECIPE_REPOSITORY_SERVER_MOUNT_POINT && pnpm migrate:deploy && pnpm start:prod"]