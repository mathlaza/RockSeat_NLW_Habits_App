import { prisma } from "./lib/prisma";
import { FastifyInstance } from "fastify"; // Para poder tipar o app

export async function appRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const habits = await prisma.habit.findMany()
    return habits;
  })
}
