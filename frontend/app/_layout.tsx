import {Stack, useRouter} from "expo-router";
import {MD3LightTheme, PaperProvider} from "react-native-paper";
import Toast from "react-native-toast-message";
import {AuthProvider, useAuth} from "@/security/AuthProvider";
import {User} from "@/api";
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
      <StatusBar />
    </>
  );
}

function AppRoutes() {
  const {user} = useAuth();

  return (
    <Stack>
      {/* Public routes */}
      <Stack.Screen
        name="auth/login"
        options={{
          headerShown: false,
        }}
        listeners={{
          focus: noAuthGuard(user)
        }}
      />
      <Stack.Screen
        name="auth/register"
        options={{
          headerShown: false,
        }}
        listeners={{
          focus: noAuthGuard(user)
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      {/* Protected routes */}
      <Stack.Screen
        name="protected/map"
        options={{
          headerShown: false,
        }}
        listeners={{
          focus: authGuard(user)
        }}
      />
      <Stack.Screen
        name="protected/preferencesSelectionScreen"
        options={{
          headerShown: false,
        }}
        listeners={{
          focus: authGuard(user)
        }}
      />
    </Stack>
  );
}

function authGuard(user?: User) {
  const router = useRouter();
  return () => {
    if (!user) {
      router.replace('/auth/login');
    }
  };
}

function noAuthGuard(user?: User) {
  const router = useRouter();
  return () => {
    if (user) {
      router.dismiss();
    }
  };
}
