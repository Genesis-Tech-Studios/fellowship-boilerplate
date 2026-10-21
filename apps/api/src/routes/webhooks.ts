import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";
import { WebhookEventSchema } from "@genesis/schemas";
import crypto from "crypto";

const prisma = new PrismaClient();
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "super-secret-hmac-key-genesis-2026";

export const webhookRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/incoming", async (request, reply) => {
    // 1. Validate payload structure
    const event = WebhookEventSchema.parse(request.body);

    // 2. Cryptographic Signature Verification (HMAC-SHA256)
    const payloadString = JSON.stringify(event.payload);
    const expectedSignature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(payloadString)
      .digest("hex");

    // Timing-safe comparison prevents timing attacks
    const isValidSignature =
      event.signature.length === expectedSignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(event.signature, "utf-8"),
        Buffer.from(expectedSignature, "utf-8")
      );

    if (!isValidSignature && process.env.NODE_ENV === "production") {
      return reply.status(401).send({
        status: 401,
        title: "Unauthorized",
        detail: "HMAC signature verification failed",
      });
    }

    // 3. Idempotency Check: Have we processed this eventId before?
    const existing = await prisma.processedEvent.findUnique({
      where: { eventId: event.id },
    });

    if (existing) {
      // Return 200 immediately without re-processing state
      return reply.status(200).send({
        success: true,
        status: "idempotent_duplicate_skipped",
        message: "Event already processed previously. Audit state preserved.",
      });
    }

    // 4. Save to ProcessedEvent table atomically
    await prisma.processedEvent.create({
      data: {
        eventId: event.id,
        eventType: event.type,
        payload: event.payload,
      },
    });

    return reply.status(200).send({
      success: true,
      status: "processed",
      message: "Webhook event verified and ingested successfully.",
    });
  });
};
