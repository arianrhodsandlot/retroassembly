ARG BUILD_IMAGE=node:26.5.0-slim
ARG PROD_IMAGE=node:26.5.0-alpine
ARG PNPM_VERSION=12.11.2

FROM ${BUILD_IMAGE} AS base
WORKDIR /app
ARG PNPM_VERSION
RUN npm i -g pnpm@${PNPM_VERSION}

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
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

FROM ${PROD_IMAGE} AS deps-production
ARG PNPM_VERSION
RUN npm i -g pnpm@${PNPM_VERSION}
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches patches
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm i --prod

FROM ${PROD_IMAGE} AS production
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src/databases ./src/databases
COPY --from=builder /app/dist ./dist
COPY --from=deps-production /app/node_modules ./node_modules

VOLUME ["/app/data"]
EXPOSE 8000
CMD ["node", "--run=start"]
