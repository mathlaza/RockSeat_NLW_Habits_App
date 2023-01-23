import { useEffect, useState } from 'react';
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
    <div>
      <ProgressBar progress={completedPercentage} />

      <HabitsList
        date={date}
        handleCompletedPercentage={handleCompletedPercentage}
        habitsInfo={habitsInfo}
        onCompletedChanged={handleCompletedChanged}
        fetchApi={fetchApi}
      />
    </div>
  );
}