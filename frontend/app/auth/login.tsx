import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Card, Text, TextInput, useTheme} from 'react-native-paper';
import Toast from "react-native-toast-message";
import {useAuth} from "@/security/AuthProvider";
import {useRouter} from "expo-router";

export default function Login() {
  const auth = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();

  const handleLogin = () => {
    auth.login({email, password}).then((loginSuccess) => {
      if (!loginSuccess) {
        Toast.show({
          type: 'error',
          text1: 'Wrong credentials',
          text2: 'Try again!',
        });
      }
    });
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title} variant="titleLarge">
            Welcome Back!
          </Text>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Login
          </Button>
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.link} onPress={() => router.navigate("/auth/register")}>Sign Up</Text>
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    padding: 16,
    elevation: 4,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  buttonContent: {
    height: 48,
  },
  footerText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  link: {
    color: '#1E88E5', // Customize link color
    fontWeight: 'bold',
  },
});
