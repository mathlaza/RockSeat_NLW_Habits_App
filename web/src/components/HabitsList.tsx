import * as Checkbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Check, X } from 'phosphor-react';
import { api } from '../lib/axios';
import { calculateCompletedPercentage } from '../utils/calculate-completed-percentage';
import { IHabitsInfo } from './ModalHabits';

interface IHabitsList {
  date: Date;
  handleCompletedPercentage: (percentage: number) => void;
  habitsInfo: IHabitsInfo;
  onCompletedChanged: (
    habitsInfo: IHabitsInfo,
    completedHabits: string[]
  ) => void;
  fetchApi: () => void
}

export function HabitsList({ date, handleCompletedPercentage, habitsInfo, onCompletedChanged, fetchApi }: IHabitsList) {

  async function handleToggleHabit(habitId: string) {
    api.patch(`habits/${habitId}/toggle`);

    const isHabitAlreadyCompleted =
      habitsInfo.completedHabits.includes(habitId);

    let completedHabits: string[] = [];

    if (isHabitAlreadyCompleted) {
      completedHabits = habitsInfo.completedHabits.filter(
        (id) => id !== habitId
      );
    } else {
      completedHabits = [...habitsInfo.completedHabits, habitId];
    }

    const updatedCompletedPercentage = calculateCompletedPercentage(
      habitsInfo.possibleHabits.length,
      completedHabits.length
    );
    handleCompletedPercentage(updatedCompletedPercentage);
    onCompletedChanged(habitsInfo, completedHabits);
  }

  async function handleDelete(habitId: string) {
    try {
      await handleToggleHabit(habitId);
      // Deleta hábito no banco de dados
      await api.delete(`/habits/${habitId}/delete`);
      // Busca os que sobraram
      fetchApi()
    } catch (error) {
      console.log(error);
      alert('Ops, não foi possível carregar as informações dos hábitos')
    }
  }

  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());

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
              <X size={32} />
            </button>
          </div>
        )
      })}
    </div>
  )
}