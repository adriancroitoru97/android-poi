import {Redirect, Stack} from 'expo-router';
import {useAuth} from "@/security/AuthProvider";

export default function AppLayout() {
  const auth = useAuth();

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!auth.user || !auth.token) {
    return <Redirect href="/auth/login"/>;
  }

  return <Stack screenOptions={{headerShown: false}}/>;
}
