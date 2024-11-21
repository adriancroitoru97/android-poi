import {Stack} from "expo-router";
import {MD3LightTheme, PaperProvider} from "react-native-paper";

const theme = {
  ...MD3LightTheme,
  roundness: 1,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#298a47',
    secondary: '#8a310f',
    tertiary: '#a1b2c3',
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{
          headerShown: false,
        }}/>
        <Stack.Screen name="login" options={{
          headerShown: false,
        }}/>
        <Stack.Screen name="register" options={{
          headerShown: false,
        }}/>
        <Stack.Screen name="map" options={{
          headerShown: false,
        }}/>
      </Stack>
    </PaperProvider>
  );
}
