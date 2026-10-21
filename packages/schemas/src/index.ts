import { z } from "zod";

// ==========================================
// 1. RFC-7807 Standard Problem Details Schema
// ==========================================
export const ProblemDetailsSchema = z.object({
  type: z.string().default("about:blank"),
  title: z.string(),
  status: z.number().int(),
  detail: z.string().optional(),
  instance: z.string().optional(),
  traceId: z.string().optional(),
  invalidParams: z
    .array(
      z.object({
        name: z.string(),
        reason: z.string(),
      })
    )
    .optional(),
});
export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;

// ==========================================
// 2. Financial & Wallet Transfer Schemas
// ==========================================
export const TransferFundsSchema = z.object({
  senderId: z.string().uuid("Invalid sender UUID"),
  receiverId: z.string().uuid("Invalid receiver UUID"),
  amount: z.number().positive("Transfer amount must be greater than 0"),
  idempotencyKey: z.string().min(8, "Idempotency key required"),
});
export type TransferFundsInput = z.infer<typeof TransferFundsSchema>;

// ==========================================
// 3. Concurrency & Booking Reservation Schemas
// ==========================================
export const ReserveInventorySchema = z.object({
  itemId: z.string().uuid("Invalid item UUID"),
  userId: z.string().uuid("Invalid user UUID"),
  expectedVersion: z.number().int().nonnegative(),
  quantity: z.number().int().positive().default(1),
});
export type ReserveInventoryInput = z.infer<typeof ReserveInventorySchema>;

// ==========================================
// 4. Webhook & Event Ingestion Schemas
// ==========================================
export const WebhookEventSchema = z.object({
  id: z.string().min(1, "Event ID required"),
  type: z.string(),
  timestamp: z.number().int(),
  signature: z.string().min(32, "Cryptographic signature required"),
  payload: z.record(z.string(), z.any()),
});
export type WebhookEvent = z.infer<typeof WebhookEventSchema>;

// ==========================================
// 5. Web3 EIP-712 Typed Data Voucher Schema
// ==========================================
export const Eip712VoucherSchema = z.object({
  recipient: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid EVM address"),
  amount: z.string().regex(/^\d+$/, "Amount must be a numeric string in wei"),
  nonce: z.number().int().nonnegative(),
  deadline: z.number().int().positive(),
  signature: z.string().regex(/^0x[a-fA-F0-9]{130}$/, "Invalid 65-byte ECDSA signature"),
});
export type Eip712Voucher = z.infer<typeof Eip712VoucherSchema>;
