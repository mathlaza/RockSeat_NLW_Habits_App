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

  app.get('/day', async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(), // envia uma string e converte em date 
    })

    const { date } = getDayParams.parse(request.query) // localhost:3333/day?date=2023-01-19T00

    const weekDay = dayjs(date).get('day'); // Pega o dia da semana

    // todos hábitos possíveis
    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date, // Mostra apenas hábitos que foram criados até aquela data
        },
        weekDays: {
          some: {
            week_day: weekDay,
          }
        }
      }
    })

    return {
      possibleHabits,
    }
  })
}
