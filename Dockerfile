FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node src/ ./src/

ENV MCP_TRANSPORT=http
ENV MCP_HTTP_PORT=3001
EXPOSE 3001

USER node
CMD ["npx", "tsx", "src/index.ts"]
