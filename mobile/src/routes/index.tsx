import { View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from "./app.routes";

export function Routes() {
  return (
    // Quando sai de uma tela pra outra dá um glitch branco, por isso essa estilização abaixo
    <View className="flex-1 bg-background">
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </View>
  )
}
