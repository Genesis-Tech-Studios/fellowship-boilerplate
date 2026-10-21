# 🚀 Genesis Tech Studios // 12-Week Fellowship & Production Residency Boilerplate

[![Genesis Residency](https://img.shields.io/badge/GENESIS-RESIDENCY-F5C800?style=for-the-badge&logoColor=black)](https://github.com/Genesis-Tech-Studios/fellowship-boilerplate)
[![Turborepo](https://img.shields.io/badge/TURBOREPO-MONOREPO-blue?style=for-the-badge&logo=turborepo)](https://turbo.build/)
[![TypeScript](https://img.shields.io/badge/TYPESCRIPT-STRICT-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Foundry](https://img.shields.io/badge/FOUNDRY-SOLIDITY-red?style=for-the-badge&logo=solidity)](https://getfoundry.sh/)

Welcome to the official monorepo boilerplate for the **Genesis Tech Studios 12-Week Fellowship & Production Residency**.

This repository serves all 4 core engineering tracks:
- 🎨 **Frontend Engineering:** `apps/web` (Next.js 19 App Router, TanStack Query v5, Wagmi/Viem, Tailwind)
- ⚙️ **Backend Engineering:** `apps/api` (Fastify, TypeScript, PostgreSQL, Prisma OCC, Redis, BullMQ)
- ⛓️ **Web3 & Smart Contracts:** `packages/contracts` (Foundry, Solidity 0.8.20, OpenZeppelin v5, CEI Defense)
- 🌐 **Full-Stack Systems:** All workspaces coordinated via `packages/schemas` (Shared Zod contracts)

---

## ⚡ 1-Minute Student Quick Start

### Step 1: Fork or Use This Template
1. Click the green **"Use this template"** button (or **"Fork"**) at the top right of this repository.
2. Create a new repository under **your personal GitHub account** (e.g., `github.com/your-username/fellowship-sprints`).
3. Set visibility to **Public**.

### Step 2: Clone Your Personal Copy
```bash
git clone https://github.com/<YOUR-USERNAME>/fellowship-sprints.git
cd fellowship-sprints
```

### Step 3: Install Dependencies & Spin Up Infrastructure
```bash
# 1. Install all monorepo dependencies (pnpm required)
pnpm install

# 2. Start PostgreSQL 16 & Redis in the background
docker compose up -d

# 3. Copy environment variables
cp .env.example .env
```

### Step 4: Run the Development Stack
```bash
# Launch both web app (port 3000) and backend API (port 3001)
pnpm dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🧭 Monorepo Architecture Directory

```
fellowship-boilerplate/
├── apps/
│   ├── web/               ──► 🎨 FRONTEND TRACK (Next.js 19, TanStack Query, Wagmi, Tailwind)
│   └── api/               ──► ⚙️ BACKEND TRACK (Fastify, Prisma ORM, BullMQ, Redis, K6)
├── packages/
│   ├── contracts/         ──► ⛓️ WEB3 TRACK (Foundry, Solidity 0.8.20, Solady, Slither)
│   └── schemas/           ──► 🌐 SHARED ZOD CONTRACTS (Single source of truth)
├── docker-compose.yml     ──► One-command local PostgreSQL 16 & Redis
└── turbo.json             ──► Blazing-fast cached build pipeline
```

---

## 🛠️ Track-by-Track Execution Guides

### 🎨 1. Frontend Track (`apps/web`)
Focus on client-side state, optimistic rollbacks, zero layout shifts (CLS), and Web3 reactive state:
```bash
# Run only frontend dev server
pnpm --filter @genesis/web dev

# Key directories:
# • apps/web/src/components/ErrorBoundary.tsx  (RFC-7807 error boundaries)
# • apps/web/src/components/OptimisticUpvote.tsx (Snapshot rollback handling)
# • apps/web/src/components/VirtualList.tsx     (10,000 item 60 FPS virtualization)
```

### ⚙️ 2. Backend Track (`apps/api`)
Focus on database isolation, Optimistic Concurrency Control (OCC), Redis queues, and idempotent webhooks:
```bash
# Run Prisma database migrations
pnpm --filter @genesis/api prisma:migrate

# Launch backend Fastify server
pnpm --filter @genesis/api dev

# Run automated 100-worker concurrency stress test
pnpm test:concurrency
```

### ⛓️ 3. Web3 & Smart Contracts Track (`packages/contracts`)
Focus on EVM storage slot optimization, CEI reentrancy immunity, and Foundry invariant tests:
```bash
cd packages/contracts

# Run all unit tests with full execution traces
forge test -vvv

# Inspect EVM storage slots and check gas snapshot savings
forge inspect GenesisToken storageLayout
forge snapshot

# Assert reentrancy defense holding against live exploit contract
forge test --match-test test_reentrancy_attack_reverts
```

### 🌐 4. Full-Stack Systems Track
Orchestrate end-to-end data pipelines and shared schemas:
```bash
# Build all packages with Turborepo caching
pnpm build

# Shared schemas are located in packages/schemas/src/index.ts
```

---

## 📝 How to Submit Weekly Deliverables

To get graded and earn milestone bounties on the **[BuildGenesis Student Cockpit](http://localhost:3000/student/dashboard)**:

1. **Create a Sprint Branch in your personal repo:**
   ```bash
   git checkout -b sprint/week-01-scaffolding
   ```
2. **Build your deliverable & run verification tests:**
   ```bash
   pnpm test
   ```
3. **Commit using Conventional Commits:**
   ```bash
   git commit -m "feat(api): implement RFC-7807 problem details error envelopes"
   git push origin sprint/week-01-scaffolding
   ```
4. **Open a Pull Request** in your personal GitHub repository.
5. **Paste your PR URL** into the **Deliverable Submission Form** in your **BuildGenesis Student Cockpit**.
6. Mentors review your diff against the 4-part rubric (Code Integrity, Resilience, Git Hygiene, Presentation) and disburse bounties!

---

## 📜 License
MIT License. Built with ❤️ by [Genesis Tech Studios](https://genesistechstudios.com).
