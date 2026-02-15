FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps
COPY tsconfig.json ./
COPY src/ ./src/

USER node
CMD ["npx", "tsx", "src/index.ts"]
