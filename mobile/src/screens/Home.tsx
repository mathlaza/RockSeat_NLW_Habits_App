import { useNavigation } from '@react-navigation/native';
import { View, Text, ScrollView, Alert } from 'react-native';
import { HabitDay, DAY_SIZE } from '../components/HabitDay';
import { Header } from '../components/Header';
import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates';
import { api } from '../lib/axios';
import { useState, useEffect } from 'react';
import { Loading } from '../components/Loading';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const summaryDates = generateRangeDatesFromYearStart();
const summaryTableArea = 18 * 5; // 18 semanas de quadradinhos
const amountOfDaysToFill = summaryTableArea - summaryDates.length;

export function Home() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  const { navigate } = useNavigation();

  async function fetchData() {
    try {
      setLoading(true);
      const response = await api.get('/summary');
      console.log(response.data);
      setSummary(response.data);
    } catch (error) {
      Alert.alert('Ops', 'Não foi possível carregar o sumário de hábitos.')
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(); // Executa a função no momento que o componente é montado
  }, []);

  if(loading) {
    return (
      <Loading />
    )
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      {/* Letras dos dias da semana */}
      <View className="flex-row mt-6 mb-2">
        {
          weekDays.map((weekDay, i) => (
            <Text
              key={i}
              className="text-zinc-400 text-xl font-bold text-center mx-1"
              style={{ width: DAY_SIZE }}
            >
              {weekDay}
            </Text>
          ))
        }
      </View>

      {/* Quadradinhos ativos e não ativos */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View className="flex-row flex-wrap">
          {
            summaryDates.map((date) => (
              <HabitDay
                key={date.toISOString()}
                onPress={() => navigate('habit', { date: date.toISOString() })}
              />
            ))
          }

          {
            amountOfDaysToFill > 0 && Array
              .from({ length: amountOfDaysToFill })
              .map((_, i) => (
                <View
                  key={i}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                />
              ))
          }
        </View>
      </ScrollView>
    </View>
  )
}