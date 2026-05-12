# Base
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN addgroup nodejs && adduser -S -G nodejs nestjs
WORKDIR /app

# Deps
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --ignore-scripts

# Build
FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm build

# Runner
FROM base AS runner
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist

COPY DockerEntryPoint.sh ./DockerEntryPoint.sh
RUN chmod +x ./DockerEntryPoint.sh
RUN mkdir -p ./logs && chown -R nestjs:nodejs ./logs

USER nestjs
ENTRYPOINT ["./DockerEntryPoint.sh"]
