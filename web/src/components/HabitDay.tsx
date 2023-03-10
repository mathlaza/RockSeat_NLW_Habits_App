import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useState } from 'react';
import { ModalHabits } from './ModalHabits';
import { calculateCompletedPercentage } from '../utils/calculate-completed-percentage';

interface IHabitDay {
  date: Date
  defaultCompleted?: number
  amount?: number
}

export function HabitDay({ defaultCompleted = 0, amount = 0, date }: IHabitDay) {
  const defaultCompletedPercentage = calculateCompletedPercentage(
    amount,
    defaultCompleted
  );

  const [completedPercentage, setCompletedPercentage] = useState(defaultCompletedPercentage);

  const dayAndMonth = dayjs(date).format('DD/MM')
  const dayOfWeek = dayjs(date).format('dddd')

  const today = dayjs().startOf('day').toDate();
  const isToday = dayjs(date).isSame(today);

  function handleCompletedPercentage(completed: number) {
    setCompletedPercentage(completed);
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        className={clsx('w-10 h-10 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-blackBackground', {
          'bg-zinc-900 border-zinc-800': completedPercentage === 0,
          'bg-violet-900 border-violet-700': completedPercentage > 0 && completedPercentage < 20,
          'bg-violet-800 border-violet-600': completedPercentage >= 20 && completedPercentage < 40,
          'bg-violet-700 border-violet-500': completedPercentage >= 40 && completedPercentage < 60,
          'bg-violet-600 border-violet-500': completedPercentage >= 60 && completedPercentage < 80,
          'bg-violet-500 border-violet-400': completedPercentage >= 80,
          'border-white border-4': isToday // Se o dia for o atual (hoje), deixa o quadradinho com uma borda
        })}
      />

      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
          <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">{dayAndMonth}</span>

          <ModalHabits
            date={date}
            handleCompletedPercentage={handleCompletedPercentage}
            completedPercentage={completedPercentage}
          />

          <Popover.Arrow height={9} width={16} className="fill-zinc-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}