import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";
import { Feather } from '@expo/vector-icons';
import colors from "tailwindcss/colors";

interface Params {
  date: string;
}

interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[];
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [remove, setRemove] = useState(false);

  const route = useRoute();
  const { date } = route.params as Params;
  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date()); //Verifica se dia já passou
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');
  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length)
    : 0;

  async function fetchHabits() {
    try {
      setLoading(true);

      const response = await api.get('/day', { params: { date } });
      setDayInfo(response.data);
      setCompletedHabits(response.data.completedHabits);

    } catch (error) {
      console.log(error);
      Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos')
    }
    finally {
      setLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`);

      if (completedHabits.includes(habitId)) {
        setCompletedHabits(prevState => prevState.filter((habit) => habit !== habitId));
      } else {
        setCompletedHabits(prevState => [...prevState, habitId]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Ops', 'Não foi possível atualizar o status do hábito');
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return (
      <Loading />
    )
  }


  async function handleDelete(habitId: string) {
    try {
      // Deleta hábito no banco de dados
      await api.delete(`/habits/${habitId}/delete`);
      // Busca os que sobraram
      fetchHabits()
    } catch (error) {
      console.log(error);
      Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos')
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <BackButton />
        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className={clsx("mt-6", {
          ['opacity-50']: isDateInPast // Deixa opaco os hábitos de datas passadas
        })}>
          {
            dayInfo?.possibleHabits.length !== 0 ?
              dayInfo?.possibleHabits.map((habit) => (
                <Text
                  key={habit.id}
                  className="flex flex-col"
                >
                  <Checkbox
                    title={habit.title}
                    checked={completedHabits.includes(habit.id)}
                    disabled={isDateInPast}
                    onPress={() => handleToggleHabit(habit.id)}
                    isInHabitsPage={true}
                    className="pr-3"
                  />

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleDelete(habit.id)}
                    disabled={isDateInPast}
                    className={clsx("bg-zinc-800", "rounded-xl", {
                      ['opacity-0']: isDateInPast
                    })}
                  >
                    <Feather
                      name="x"
                      size={32}
                      color={colors.zinc[400]}
                    />
                  </TouchableOpacity>
                </Text>
              ))
              : <HabitsEmpty />
          }
        </View>

        {
          isDateInPast && (
            <Text className="text-white mt-10 text-center">
              Você não pode completar hábitos de uma data passada.
            </Text>
          )
        }
      </ScrollView>
    </View>
  )
}