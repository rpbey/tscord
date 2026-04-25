# Multi-stage build pour optimiser la taille de l'image finale.
# Runtime cible : Bun (no Node).

# ============================
# ==== Dependencies stage ====
# ============================
FROM oven/bun:1.3-alpine AS dependencies

    WORKDIR /app

    COPY package.json bun.lock ./

    RUN apk add --no-cache --virtual .build-deps alpine-sdk python3 && \
        bun install --frozen-lockfile && \
        apk del .build-deps

# ======================
# ===== Build stage ====
# ======================
FROM oven/bun:1.3-alpine AS builder

    WORKDIR /app

    COPY src ./src
    COPY tsconfig.json ./

    COPY --from=dependencies /app/package.json /app/bun.lock /app/
    COPY --from=dependencies /app/node_modules /app/node_modules

    RUN bun run install:plugins
    RUN bun run build

# ========================
# ===== Prepare stage ====
# ========================
FROM oven/bun:1.3-alpine AS prepare

    WORKDIR /app

    COPY --from=builder /app/build /app/build
    COPY --from=builder /app/package.json /app/bun.lock /app/

    RUN bun install --production --frozen-lockfile

# =====================
# ===== Run stage =====
# =====================
FROM oven/bun:1.3-alpine AS runner

    WORKDIR /app

    ENV NODE_ENV=production

    COPY --from=prepare /app/build /app/build
    COPY --from=prepare /app/package.json /app/
    COPY --from=prepare /app/node_modules /app/node_modules

    CMD ["bun", "run", "start"]
