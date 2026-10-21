import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { z } from "zod";
import crypto from "crypto";
import { walletRoutes } from "./routes/wallet";
import { inventoryRoutes } from "./routes/inventory";
import { webhookRoutes } from "./routes/webhooks";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: { translateTime: "HH:MM:ss Z", ignore: "pid,hostname" },
    },
  },
});

// Middleware: CORS & Helmet Security Headers
fastify.register(cors, { origin: true });
fastify.register(helmet, { contentSecurityPolicy: false });

// Request Correlation Hook (Distributed Tracing)
fastify.addHook("onRequest", async (request, reply) => {
  const traceId = (request.headers["x-trace-id"] as string) || crypto.randomUUID();
  request.headers["x-trace-id"] = traceId;
  reply.header("x-trace-id", traceId);
});

// Global Error Handler: RFC-7807 Standard Problem Details
fastify.setErrorHandler((error, request, reply) => {
  const traceId = request.headers["x-trace-id"] as string;

  if (error instanceof z.ZodError) {
    return reply.status(400).header("Content-Type", "application/problem+json").send({
      type: "https://httpstatuses.com/400",
      title: "Validation Error",
      status: 400,
      detail: "The payload failed schema validation",
      instance: request.url,
      traceId,
      invalidParams: error.issues.map((issue) => ({
        name: issue.path.join("."),
        reason: issue.message,
      })),
    });
  }

  // Handle known 409 Conflict (Concurrency Collision)
  if (error.message.includes("Conflict") || error.statusCode === 409) {
    return reply.status(409).header("Content-Type", "application/problem+json").send({
      type: "https://httpstatuses.com/409",
      title: "Resource Conflict (OCC)",
      status: 409,
      detail: error.message,
      instance: request.url,
      traceId,
    });
  }

  // Catch-all 500 Internal Server Error
  fastify.log.error(error);
  return reply.status(500).header("Content-Type", "application/problem+json").send({
    type: "https://httpstatuses.com/500",
    title: "Internal Server Error",
    status: 500,
    detail: "An unexpected condition was encountered",
    instance: request.url,
    traceId,
  });
});

// Health & Status Probe
fastify.get("/health", async () => ({
  status: "healthy",
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || "development",
}));

// Register Engineering Sprints Routes
fastify.register(walletRoutes, { prefix: "/api/wallet" });
fastify.register(inventoryRoutes, { prefix: "/api/inventory" });
fastify.register(webhookRoutes, { prefix: "/api/webhooks" });

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`🚀 Genesis Backend API running at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
