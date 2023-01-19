import { prisma } from "./lib/prisma";
import { FastifyInstance } from "fastify"; // Para poder tipar o app
import { z } from "zod"; // Valida os dados do request
import dayjs from "dayjs";

export async function appRoutes(app: FastifyInstance) {
  app.post('/habits', async (request) => {
    const createHabitBody = z.object({
      title: z.string(), // Title obrigatório, se não for, só add .nullable()
      weekDays: z.array(z.number().min(0).max(6)) // Recebe array de números do 0 ao 6
    })
    const { title, weekDays } = createHabitBody.parse(request.body)

    // startOf zera as horas, min e seg, e toDate retorna um date do javascript
    const today = dayjs().startOf('day').toDate(); // Retorna a data atual com horários zerados

    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map(weekDay => {
            return {
              week_day: weekDay,
            }
          })
        }
      }
    })
  })
}
