import {Redirect, Stack} from 'expo-router';
import {useAuth} from "@/security/AuthProvider";

export default function AuthLayout() {
  const auth = useAuth();

  if (auth.loggedIn) {
    return <Redirect href={'/'}/>
  }

  return <Stack screenOptions={{headerShown: false}}/>;
}
