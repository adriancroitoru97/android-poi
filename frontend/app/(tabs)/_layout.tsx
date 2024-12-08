import {Redirect, Tabs} from 'expo-router';
import React from 'react';
import {useTheme} from "react-native-paper";
import {MaterialIcons} from "@expo/vector-icons";
import TabBarBackground from "@/components/TabBarBackground";
import {useAuth} from "@/security/AuthProvider";

export default function TabLayout() {
  const theme = useTheme();
  const auth = useAuth();

  // Redirect to login if the user is not authenticated
  if (!auth.loggedIn) {
    return <Redirect href="/(auth)/login"/>;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: false,
        tabBarBackground: TabBarBackground,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({color}) => <MaterialIcons size={28} name="home" color={color}/>,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({color}) => <MaterialIcons size={28} name="map" color={color}/>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({color}) => <MaterialIcons size={28} name="person" color={color}/>,
        }}
      />
    </Tabs>
  );
}
