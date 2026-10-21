import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";
import { TransferFundsSchema } from "@genesis/schemas";

const prisma = new PrismaClient();

export const walletRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/transfer", async (request, reply) => {
    // 1. Strict validation via shared Zod schema
    const data = TransferFundsSchema.parse(request.body);

    // 2. ACID Transaction Execution
    const result = await prisma.$transaction(async (tx) => {
      // Find sender wallet
      const sender = await tx.wallet.findUnique({
        where: { userId: data.senderId },
      });

      if (!sender || Number(sender.balance) < data.amount) {
        throw new Error("Insufficient funds to complete transfer");
      }

      // Decrement sender balance atomically
      const updatedSender = await tx.wallet.update({
        where: { userId: data.senderId },
        data: { balance: { decrement: data.amount } },
      });

      // Increment receiver balance atomically
      const updatedReceiver = await tx.wallet.update({
        where: { userId: data.receiverId },
        data: { balance: { increment: data.amount } },
      });

      return {
        senderBalance: updatedSender.balance,
        receiverBalance: updatedReceiver.balance,
      };
    });

    return reply.status(200).send({
      success: true,
      message: "Transfer completed atomically with zero balance drift",
      data: result,
    });
  });
};
