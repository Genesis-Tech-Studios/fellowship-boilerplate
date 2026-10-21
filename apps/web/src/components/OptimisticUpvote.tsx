"use client";

import React, { useState } from "react";
import { ThumbsUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function OptimisticUpvote() {
  const [likes, setLikes] = useState(42);
  const [isLiked, setIsLiked] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleToggleLike = async () => {
    // 1. Snapshot previous state
    const previousLikes = likes;
    const previousIsLiked = isLiked;

    // 2. Optimistic Update (Instant UI feedback, zero latency)
    const nextIsLiked = !isLiked;
    const nextLikes = nextIsLiked ? likes + 1 : likes - 1;
    setLikes(nextLikes);
    setIsLiked(nextIsLiked);

    setIsPending(true);

    try {
      // Simulate network request
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (simulateFailure) {
            reject(new Error("Synthetic 500: Server rejected mutation."));
          } else {
            resolve({ success: true });
          }
        }, 600);
      });

      toast.success("State synchronized with server!");
    } catch (err: any) {
      // 3. Rollback on failure
      setLikes(previousLikes);
      setIsLiked(previousIsLiked);
      toast.error(err.message || "Mutation failed. State rolled back gracefully.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="p-6 border border-neutral-200 bg-white shadow-sm rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-neutral-900">
            Optimistic UI & Deterministic Rollback
          </h4>
          <p className="text-xs text-neutral-500">
            Week 03 Deliverable: Instant mutation feedback with snapshot restoration.
          </p>
        </div>

        <button
          onClick={handleToggleLike}
          disabled={isPending}
          className={`px-4 py-2 text-xs font-mono font-bold rounded-lg border flex items-center gap-2 transition-all ${
            isLiked
              ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm"
              : "bg-neutral-50 hover:bg-neutral-100 border-neutral-300 text-neutral-700"
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-emerald-600" : ""}`} />
          <span>{likes} Upvotes</span>
        </button>
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
          <input
            type="checkbox"
            checked={simulateFailure}
            onChange={(e) => setSimulateFailure(e.target.checked)}
            className="rounded text-amber-600"
          />
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Simulate Synthetic 500 Failure (Trigger Rollback)
          </span>
        </label>
      </div>
    </div>
  );
}
