import colors from "tailwindcss/colors";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from "react-native";

export function BackButton() {
  const { navigate } = useNavigation();

  function goBack() {
    navigate('home');
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={goBack}
    >
      <Feather
        name="arrow-left"
        size={32}
        color={colors.zinc[400]}
      />
    </TouchableOpacity>
  );
}