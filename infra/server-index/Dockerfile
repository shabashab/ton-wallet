FROM node:22

RUN npm install -g corepack
RUN corepack enable

WORKDIR /app
COPY . .
RUN pnpm install --filter "@ton-wallet/server-index..." --frozen-lockfile
WORKDIR /app/apps/server-index
RUN pnpm turbo build

CMD ["pnpm", "start:production"]