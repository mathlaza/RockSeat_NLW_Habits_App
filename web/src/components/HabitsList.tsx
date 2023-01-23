import * as Checkbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Check, X } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface HabitsListProps {
  date: Date
  onCompletedChanged: (completed: number) => void
}

interface HabitsInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[],
  completedHabits: string[]
}

export function HabitsList({ date, onCompletedChanged }: HabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()

  function fetchHabits() {
    api.get('/day', {
      params: { // Tudo nesse objeto será convertido para query params
        date: date.toISOString(),
      }
    }).then(response => {
      setHabitsInfo(response.data);
    })
  }

  useEffect(() => {
    fetchHabits()
  }, []);

  // Desabilita o check em datas passadas:
  const isDateInPast = dayjs(date) // Pega a data
    .endOf('day') // Coloca o horário dela pro final do dia
    .isBefore(new Date()); // E aí sim valida que é a anterior

  async function handleToggleHabit(habitId: string) {
    await api.patch(`/habits/${habitId}/toggle`)

    const isHabitAlreadyCompleted = habitsInfo?.completedHabits.includes(habitId);
    let completedHabits: string[] = [];

    if (isHabitAlreadyCompleted) {
      completedHabits = habitsInfo!.completedHabits.filter((id) => id !== habitId);
    } else {
      completedHabits = [...habitsInfo!.completedHabits, habitId];
    }

    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits,
    })

    onCompletedChanged(completedHabits.length);
  }

  async function handleDelete(habitId: string) {
    try {
      await handleToggleHabit(habitId);
      // Deleta hábito no banco de dados
      await api.delete(`/habits/${habitId}/delete`);
      // Busca os que sobraram
      fetchHabits()
      // Update em HabitDay após a remoção
    } catch (error) {
      console.log(error);
      alert('Ops, não foi possível carregar as informações dos hábitos')
    }
  }

  return (
    <div className="mt-6 flex-col gap-3">
      {habitsInfo?.possibleHabits.map((habit) => {
        return (
          <div
            key={habit.id}
            className="flex flex-rowr"
          >
            <Checkbox.Root
              onCheckedChange={() => handleToggleHabit(habit.id)}
              checked={habitsInfo.completedHabits.includes(habit.id)}
              disabled={isDateInPast}
              className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors focus:outline-none group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-blackBackground">
                <Checkbox.Indicator>
                  <Check size={20} className="text-white" />
                </Checkbox.Indicator>
              </div>

              <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                {habit.title}
              </span>
            </Checkbox.Root>

            <button
              onClick={() => handleDelete(habit.id)}
              className={clsx("bg-zinc-800", "rounded-xl", "ml-3", {
                ['opacity-0']: isDateInPast
              })}
              disabled={isDateInPast}
            >
              <X size={32}/>
            </button>
          </div>
        )
      })}
    </div>
  )
}