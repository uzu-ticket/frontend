# ─────────────────────────────────────────────
# Stage 1 — Install all dependencies
# ─────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache openssl
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ─────────────────────────────────────────────
# Stage 2 — Builder (TypeScript + Prisma Client)
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# ─────────────────────────────────────────────
# Stage 3 — Production dependencies only
# ─────────────────────────────────────────────
FROM node:20-alpine AS prod-deps
RUN apk add --no-cache openssl
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY prisma ./prisma
RUN npx prisma generate

# ─────────────────────────────────────────────
# Stage 4 — Lean Production Runner
# ─────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production

# Run as non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/dist          ./dist
COPY --from=prod-deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/prisma        ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/package.json  ./package.json

USER nestjs

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
