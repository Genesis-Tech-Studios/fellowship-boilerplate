import React from "react";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { OptimisticUpvote } from "../components/OptimisticUpvote";
import { VirtualList } from "../components/VirtualList";
import { Code2, ExternalLink, ShieldCheck, Terminal, Layers } from "lucide-react";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto p-6 md:p-12 space-y-8 font-sans">
      {/* Track Monorepo Hero Header */}
      <div className="bg-[#111111] text-[#FBFBF9] p-8 rounded-none border border-neutral-800 shadow-[6px_6px_0_0_#F5C800]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-block px-2.5 py-1 text-[10px] font-mono font-bold bg-[#F5C800] text-neutral-900 uppercase tracking-wider mb-2">
              Genesis Tech Studios // Fellowship Monorepo
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              Production Residency Boilerplate
            </h1>
            <p className="text-xs text-neutral-300 mt-1 max-w-xl">
              Clean monorepo architecture linking Next.js 19, Fastify, Prisma, Redis, and Foundry Solidity contracts.
            </p>
          </div>

          <a
            href="https://github.com/Genesis-Tech-Studios/fellowship-boilerplate"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#F5C800] hover:bg-amber-400 text-neutral-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shrink-0"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Track Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border border-neutral-200 bg-white rounded-lg space-y-1">
          <div className="text-[10px] font-mono text-neutral-400 uppercase font-bold flex items-center gap-1">
            <Code2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Frontend Track</span>
          </div>
          <div className="text-xs font-bold text-neutral-900">apps/web</div>
          <p className="text-[11px] text-neutral-500">Next.js App Router, TanStack Query, Wagmi/Viem</p>
        </div>

        <div className="p-4 border border-neutral-200 bg-white rounded-lg space-y-1">
          <div className="text-[10px] font-mono text-neutral-400 uppercase font-bold flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            <span>Backend Track</span>
          </div>
          <div className="text-xs font-bold text-neutral-900">apps/api</div>
          <p className="text-[11px] text-neutral-500">Fastify, PostgreSQL, Prisma OCC, Redis BullMQ</p>
        </div>

        <div className="p-4 border border-neutral-200 bg-white rounded-lg space-y-1">
          <div className="text-[10px] font-mono text-neutral-400 uppercase font-bold flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>Web3 & Protocol Track</span>
          </div>
          <div className="text-xs font-bold text-neutral-900">packages/contracts</div>
          <p className="text-[11px] text-neutral-500">Foundry, Solidity 0.8.20, CEI Reentrancy, Slither</p>
        </div>
      </div>

      {/* Interactive Sprint Deliverable Demonstrations */}
      <div className="space-y-6">
        <div className="border-b border-neutral-200 pb-2">
          <h2 className="text-lg font-bold uppercase tracking-tight text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Interactive Sprint Demonstrations</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Pre-built production implementations students can inspect, run, and adapt for weekly PR submissions.
          </p>
        </div>

        {/* 1. Optimistic Rollback Deliverable */}
        <OptimisticUpvote />

        {/* 2. Virtualized List Deliverable */}
        <VirtualList />

        {/* 3. Error Boundary Deliverable */}
        <ErrorBoundary fallbackTitle="Data Pipeline Failure (RFC-7807 Protected)">
          <div className="p-6 border border-neutral-200 bg-white shadow-sm rounded-lg flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-neutral-900">
                Resilient Layout Error Boundary
              </h4>
              <p className="text-xs text-neutral-500">
                Week 01 Deliverable: Traps malformed API payloads and isolates component crashes.
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-100 text-emerald-800 rounded">
              Status: Protected
            </span>
          </div>
        </ErrorBoundary>
      </div>
    </main>
  );
}
