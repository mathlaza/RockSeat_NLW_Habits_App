import { prisma } from "./lib/prisma";
import { FastifyInstance } from "fastify"; // Para poder tipar o app
import { z } from "zod"; // Valida os dados do request
import dayjs from "dayjs";

export async function appRoutes(app: FastifyInstance) {
  // Registra um hábito
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

  // Mostra todos os hábitos daquele dia
  app.get('/day', async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(), // envia uma string e converte em date 
    })

    const { date } = getDayParams.parse(request.query); // localhost:3333/day?date=2023-01-19T00
    const parsedDate = dayjs(date).startOf('day');

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

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayHabits: true, // dayHabits são os hábitos completados
      }
    })

    const completedHabits = day?.dayHabits.map((dayHabit) => {
      return dayHabit.habit_id;
    }) // o "?" verifica se o dia existe

    return {
      possibleHabits,
      completedHabits,
    }
  })

  // Marcar e desmarcar um hábito do dia atual:
  app.patch('/habits/:id/toggle', async (request) => {
    const toggleHabitParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = toggleHabitParams.parse(request.params)
    const today = dayjs().startOf('day').toDate();

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      }
    })

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today,
        }
      })
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        }
      }
    })

    if (dayHabit) {
      // Desmarca o hábito
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id,
        }
      })
    } else {
      // Marca o hábito
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        }
      })
    }
  })

  // Retorna um resumo de informações
  app.get('/summary', async () => {
    const summary = await prisma.$queryRaw`
      SELECT D.id, D.date,
        (
          SELECT cast(count(*) as float) -- Converte BigInt p/ float 
          FROM day_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT cast(count(*) as float)
          FROM habit_week_days HWD
          JOIN habits H
            ON H.id = HWD.habit_id
          WHERE HWD.week_day = cast(strftime('%w', D.date/1000, 'unixepoch') as int)
          AND H.created_at <= D.date
        ) as amount
      FROM days D
    `
    return summary
  })
}
