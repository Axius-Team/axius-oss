FROM node:20-alpine AS builder
RUN apk add --no-cache python3 make g++ gcc
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json next.config.mjs tailwind.config.ts postcss.config.mjs ./
COPY src/ src/
COPY public/ public/

RUN pnpm install --frozen-lockfile
RUN pnpm build
RUN pnpm add -D esbuild && pnpm build:ws

FROM node:20-alpine AS runner
RUN apk add --no-cache bash su-exec
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 axius

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/dist ./dist

VOLUME /app/data

EXPOSE 8765 8766

ENV PORT=8765
ENV NODE_ENV=production

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
