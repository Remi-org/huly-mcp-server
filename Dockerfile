FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY vendor/@hcengineering/ ./node_modules/@hcengineering/

FROM base
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node src/ ./src/

ENV MCP_TRANSPORT=http
ENV MCP_HTTP_PORT=3001
EXPOSE 3001

USER node
CMD ["npx", "tsx", "src/index.ts"]
