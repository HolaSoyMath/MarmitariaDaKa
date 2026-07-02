FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY shared/schemas/package.json shared/schemas/package.json
RUN bun install --frozen-lockfile

COPY . .
RUN cd apps/backend && bunx prisma generate && bun run build

WORKDIR /app/apps/backend
EXPOSE 3000
CMD ["bun", "run", "start"]
