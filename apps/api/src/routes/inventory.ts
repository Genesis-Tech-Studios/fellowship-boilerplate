import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";
import { ReserveInventorySchema } from "@genesis/schemas";

const prisma = new PrismaClient();

export const inventoryRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/reserve", async (request, reply) => {
    // 1. Validate payload
    const data = ReserveInventorySchema.parse(request.body);

    // 2. Optimistic Concurrency Control (OCC) Execution
    // Check if the current version in database matches expectedVersion
    const result = await prisma.inventoryItem.updateMany({
      where: {
        id: data.itemId,
        version: data.expectedVersion,
        stock: { gte: data.quantity },
      },
      data: {
        stock: { decrement: data.quantity },
        version: { increment: 1 }, // Atomically bump version
      },
    });

    // If count === 0, another concurrent transaction updated this row first!
    if (result.count === 0) {
      return reply.status(409).header("Content-Type", "application/problem+json").send({
        type: "https://httpstatuses.com/409",
        title: "Conflict: Concurrent Modification",
        status: 409,
        detail: `The inventory item (version ${data.expectedVersion}) was already modified by another concurrent request. Please refresh and retry.`,
        traceId: request.headers["x-trace-id"],
      });
    }

    return reply.status(200).send({
      success: true,
      message: "Reservation confirmed with zero overselling",
      allocatedVersion: data.expectedVersion + 1,
    });
  });
};
