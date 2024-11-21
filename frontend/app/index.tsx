import {Image, StyleSheet, View} from "react-native";
import {Button, useTheme} from "react-native-paper";
import {useRouter} from "expo-router";

export default function Index() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/images/logo.png")}/>
      <View style={styles.buttons}>
        <Button icon="login" mode="elevated" style={styles.button} onPress={() => {
          router.push("/login")
        }}>LOGIN</Button>
        <Button icon="account" mode="contained" style={styles.button} onPress={() => {
          router.push("/register")
        }}>REGISTER</Button>
        <Button icon="map" mode="elevated" style={styles.button} onPress={() => {
          router.push("/map")
        }}>MAP</Button>
      </View>
    </View>
  );
}

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
  button: {}
});
