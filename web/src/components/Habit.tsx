interface HabitProps {
  completed: string;
}

export function Habit(props: HabitProps) {
  return (
    <div className="bg-lime-400">
      {props.completed}
    </div>
  )
}