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

FROM node:20-alpine AS runner
RUN apk add --no-cache bash
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 axius

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN mkdir -p /app/data && chown axius:nodejs /app/data
VOLUME /app/data

USER axius
EXPOSE 8765

ENV PORT=8765
ENV NODE_ENV=production

CMD ["node", "server.js"]
