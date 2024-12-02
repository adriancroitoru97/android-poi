import {Image, StyleSheet, Text, View} from "react-native";
import {Button,} from "react-native-paper";
import {useRouter} from "expo-router";
import {useAuth} from "@/security/AuthProvider";
import {User} from "@/api";

export default function Index() {
  const auth = useAuth();

  return (
    <View style={styles.container}>
      {auth.user ? <HomeAuth/> : <HomeNoAuth/>}
    </View>
  );
}

const HomeNoAuth = () => {
  const router = useRouter();

  return (
    <>
      <Image style={styles.logo} source={require("../assets/images/logo.png")}/>
      <View style={styles.buttons}>
        <Button icon="login" mode="elevated" style={styles.button} onPress={() => {
          router.push("/auth/login")
        }}>LOGIN</Button>
        <Button icon="account" mode="contained" style={styles.button} onPress={() => {
          router.push("/auth/register")
        }}>REGISTER</Button>
        <Button icon="map" mode="elevated" style={styles.button} onPress={() => {
          router.push("/map")
        }}>MAP</Button>
      </View>
    </>
  );
}

const HomeAuth = () => {
  const router = useRouter();
  const auth = useAuth();

  return <View style={styles.loggedInHomeContainer}>
    <UserView user={auth.user || {}}/>

    <View style={styles.buttons}>
      <Button icon="logout" mode="elevated" style={styles.button} onPress={() => {
        auth.logout();
      }}>LOGOUT</Button>
      <Button icon="map" mode="elevated" style={styles.button} onPress={() => {
        router.push("/map")
      }}>MAP</Button>
    </View>
    <View style={styles.buttons}>
      <Button icon="login" mode="elevated" style={styles.button} onPress={() => {
        router.push("/auth/login")
      }}>LOGIN</Button>
      <Button icon="account" mode="contained" style={styles.button} onPress={() => {
        router.push("/auth/register")
      }}>REGISTER</Button>
    </View>
  </View>
}

const UserView = ({user}: { user: User }) => {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return (
    <View style={userViewStyles.container}>
      {/* Greeting */}
      <Text style={userViewStyles.greeting}>Hello, {user.firstName || user.username || 'Guest'}!</Text>

      {/* User Information */}
      <View style={userViewStyles.infoContainer}>
        {user.email && <Text style={userViewStyles.info}>Email: {user.email}</Text>}
        {fullName && <Text style={userViewStyles.info}>Name: {fullName}</Text>}
        {user.role && <Text style={userViewStyles.info}>Role: {user.role}</Text>}
        {user.enabled !== undefined && (
          <Text style={userViewStyles.info}>Account Status: {user.enabled ? 'Enabled' : 'Disabled'}</Text>
        )}
      </View>
    </View>
  );
};

const userViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#298a47',
    marginBottom: 16,
  },
  infoContainer: {
    marginTop: 8,
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    height: "75%"
  },
  buttons: {
    maxWidth: "100%",
    width: "100%",
    display: 'flex',
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  button: {},
  loggedInHomeContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 30,
    marginTop: 40,
  }
});
