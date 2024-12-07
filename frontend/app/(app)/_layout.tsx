import {Redirect, Stack} from 'expo-router';
import {useAuth} from "@/security/AuthProvider";
import {HeaderRightMenu} from "@/components/HeaderRightMenu";

export default function AppLayout() {
  const auth = useAuth();

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!auth.loggedIn) {
    return <Redirect href="/auth/login"/>;
  }

  return <Stack
    screenOptions={({route}) => ({
      headerRight: () => <HeaderRightMenu/>,
    })}
  >
    <Stack.Screen name="profile" options={{title: "Profile"}}/>
    <Stack.Screen name="preferences-selection" options={{title: "Preferences selection", headerShown: false}}/>
    {/*<Stack.Screen name="map" options={{title: "Map", headerShown: false}}/>*/}
  </Stack>;
}
