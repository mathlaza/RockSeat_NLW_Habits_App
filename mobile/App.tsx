import { StatusBar } from 'react-native';
import { useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold } from '@expo-google-fonts/inter';

import { Loading } from './src/components/Loading';
import { Home } from './src/screens/Home';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  });

  if (!fontsLoaded) {
    return (
      <Loading />
    )
  }

  return (
    <>
      <Home />
      {/* Para a status bar ficar flutuando sobre nossa aplicação:  */}
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
    </>
  );
}
