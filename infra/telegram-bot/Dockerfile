FROM node:22

RUN npm install -g corepack
RUN corepack enable

WORKDIR /app
COPY . .
RUN pnpm install --filter "@ton-wallet/telegram-bot..." --frozen-lockfile
WORKDIR /app/apps/telegram-bot
RUN pnpm turbo build

CMD ["pnpm", "start:production"]