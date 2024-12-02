import {Stack} from "expo-router";
import {MD3LightTheme, PaperProvider} from "react-native-paper";
import Toast from "react-native-toast-message";
import {AuthProvider} from "@/security/AuthProvider";
import {StatusBar} from "expo-status-bar";

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
    <>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <AppRoutes/>
          <Toast/>
        </AuthProvider>
      </PaperProvider>
      <StatusBar/>
    </>
  );
}

function AppRoutes() {
  return (
    <Stack screenOptions={{headerShown: false}} />
  );
}
