import { useEffect, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import dayjs from 'dayjs';
import { api } from '../lib/axios';
import { HabitsList } from './HabitsList';
import { ProgressBar } from './ProgressBar';
import { calculateCompletedPercentage } from '../utils/calculate-completed-percentage';

interface IModalHabits {
  date: Date;
  handleCompletedPercentage: (percentage: number) => void;
  completedPercentage: number;
}

export interface IHabitsInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[];
  completedHabits: string[];
}

export function ModalHabits({ date, handleCompletedPercentage, completedPercentage }: IModalHabits) {
  const [habitsInfo, setHabitsInfo] = useState<IHabitsInfo>();

  const dateAndMonth = dayjs(date).format('DD/MM');
  const dayOfWeek = dayjs(date).format('dddd');

  function fetchApi() {
    api.get('day', {
      params: {
        date: date.toISOString(), // Tudo nesse objeto será convertido para query params
      },
    }).then((response) => {
      setHabitsInfo(response.data);

      const updatedCompletedPercentage = calculateCompletedPercentage(
        response.data.possibleHabits.length,
        response.data.completedHabits.length
      );

      handleCompletedPercentage(updatedCompletedPercentage);
    });
  }

  useEffect(() => {
    fetchApi()
  }, []);

  function handleCompletedChanged(habitsInfo: IHabitsInfo, completedHabits: string[]) {
    setHabitsInfo({
      possibleHabits: habitsInfo.possibleHabits,
      completedHabits,
    });
  }

  if (!habitsInfo) {
    return <div></div>;
  }

  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());

  return (
    <Popover.Content className='min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900'>
      <span className='font-semibold text-zinc-400 first-letter:capitalize'>
        {dayOfWeek}
      </span>
      <span className='mt-1 font-extrabold loading-tight text-3xl'>
        {dateAndMonth}
      </span>

      <ProgressBar progress={completedPercentage} />

      <HabitsList
        date={date}
        handleCompletedPercentage={handleCompletedPercentage}
        habitsInfo={habitsInfo}
        onCompletedChanged={handleCompletedChanged}
        fetchApi={fetchApi}
      />

      <Popover.Arrow height={8} width={16} className='fill-zinc-900' />
    </Popover.Content>
  );
}