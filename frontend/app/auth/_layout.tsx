import {Stack, usePathname, useRouter} from 'expo-router';
import {useAuth} from "@/security/AuthProvider";

export default function AppLayout() {
  const auth = useAuth();
  const router = useRouter();
  const currentPath = usePathname();

  if (auth.loggedIn) {
    if (currentPath === "/auth/register") {
      router.dismissTo("/preferences-selection");
      return null;
    }

    router.dismissTo('/');
    return null;
  }

  return <Stack screenOptions={{headerShown: false}}/>;
}
