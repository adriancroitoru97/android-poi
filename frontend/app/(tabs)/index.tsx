import React from "react";
import {Button, StyleSheet, Text, View} from "react-native";
import {useRouter} from "expo-router";
import {useAuth} from "@/security/AuthProvider";
import {User} from "@/api";

export default function Index() {
  const router = useRouter();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.loggedInHomeContainer}>
        <UserView user={auth.user || {}} onLogout={handleLogout}/>
      </View>
    </View>
  );
}

const UserView = ({
                    user,
                    onLogout,
                  }: {
  user: User;
  onLogout: () => void;
}) => {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
        ? "Good Afternoon"
        : "Good Evening";

  return (
    <View style={userViewStyles.container}>
      {/* Greeting */}
      <Text style={userViewStyles.greeting}>
        {greeting}, {user.firstName || user.username || "Guest"}!
      </Text>

      {/* User Information */}
      <View style={userViewStyles.infoContainer}>
        {user.email && <Text style={userViewStyles.info}>Email: {user.email}</Text>}
        {fullName && <Text style={userViewStyles.info}>Name: {fullName}</Text>}
        {user.role && <Text style={userViewStyles.info}>Role: {user.role}</Text>}
        {user.enabled !== undefined && (
          <Text style={userViewStyles.info}>
            Account Status: {user.enabled ? "Enabled" : "Disabled"}
          </Text>
        )}
      </View>

      {/* Buttons */}
      <View style={userViewStyles.buttonsContainer}>
        <Button title="Logout" onPress={onLogout} color="#d9534f"/>
      </View>
    </View>
  );
};

const userViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingTop: 64,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#298a47",
    marginBottom: 16,
    textAlign: "center",
  },
  infoContainer: {
    marginTop: 8,
    width: "100%",
  },
  info: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
    textAlign: "left",
  },
  buttonsContainer: {
    marginTop: 24,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
  },
  loggedInHomeContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
