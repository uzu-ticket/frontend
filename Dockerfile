# ─────────────────────────────────────────────
# Stage 1 — Dependency installer
# ─────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ─────────────────────────────────────────────
# Stage 2 — Builder (Nuxt build)
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NUXT_PUBLIC_API_BASE can be passed as build argument or configured in runtime
ARG NUXT_PUBLIC_API_BASE=http://localhost:4000/api
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE

RUN npm run build

# ─────────────────────────────────────────────
# Stage 3 — Production runner (Nitro server)
# ─────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nuxtjs

COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./.output

USER nuxtjs

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
