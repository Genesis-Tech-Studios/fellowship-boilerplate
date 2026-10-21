# ⚙️ Genesis Backend API Workspace

High-throughput distributed systems service built with **Fastify, TypeScript, Prisma ORM, and Redis**.

## Quick Start
```bash
# 1. Start local Postgres & Redis
docker compose up -d

# 2. Run Prisma migrations
pnpm prisma:migrate

# 3. Launch dev server with hot-reload
pnpm dev

# 4. Run automated concurrency stress test
pnpm test:concurrency
```
