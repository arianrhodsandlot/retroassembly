ARG BASE_IMAGE=node:25.2.0-alpine

FROM ${BASE_IMAGE} AS base
WORKDIR /app
# enable and download pnpm
RUN corepack enable && pnpm -v

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY patches patches
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm fetch

FROM deps AS builder
ARG RETROASSEMBLY_BUILD_TIME_VITE_VERSION
ENV RETROASSEMBLY_BUILD_TIME_VITE_VERSION=$RETROASSEMBLY_BUILD_TIME_VITE_VERSION
ENV SKIP_INSTALL_SIMPLE_GIT_HOOKS=true
COPY . .
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm i
RUN node --run=build

FROM base AS deps-production
COPY package.json pnpm-lock.yaml ./
COPY patches patches
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm i --prod

FROM ${BASE_IMAGE} AS production
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src/databases ./src/databases
COPY --from=builder /app/dist/client ./dist/client
COPY --from=builder /app/dist/server ./dist/server
COPY --from=deps-production /app/node_modules ./node_modules

VOLUME ["/app/data"]
EXPOSE 8000
CMD ["node", "--run=start"]
