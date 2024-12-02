import {Redirect, Stack} from 'expo-router';
import {useAuth} from "@/security/AuthProvider";

export default function AppLayout() {
  const auth = useAuth();

  if (auth.user || auth.token) {
    return <Redirect href="/"/>;
  }

  return <Stack screenOptions={{headerShown: false}}/>;
}
