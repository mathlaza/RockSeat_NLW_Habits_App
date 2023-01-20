import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ['query'] // Faz o log das querys
});
