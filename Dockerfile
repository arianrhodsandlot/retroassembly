FROM node:alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY patches patches
RUN corepack enable
RUN pnpm fetch

FROM base AS builder
ARG RETROASSEMBLY_BUILD_TIME_VERSION
ENV RETROASSEMBLY_BUILD_TIME_VERSION=$RETROASSEMBLY_BUILD_TIME_VERSION
ENV SKIP_INSTALL_SIMPLE_GIT_HOOKS=true
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable
RUN pnpm i
RUN node --run=build

FROM base AS deps-production
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY patches patches
RUN corepack enable
RUN pnpm i --prod

FROM base AS production
WORKDIR /app
COPY --from=builder /app/dist/client ./dist/client
COPY --from=builder /app/dist/scripts ./dist/scripts
COPY --from=builder /app/src/databases ./src/databases
COPY --from=builder /app/package.json ./
COPY --from=deps-production /app/node_modules ./node_modules
EXPOSE 8000
CMD ["node", "--run=start"]
