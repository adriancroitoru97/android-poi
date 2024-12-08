import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Card, Text, TextInput, useTheme} from 'react-native-paper';
import {useRouter} from "expo-router";
import {register} from "@/api";
import Toast from "react-native-toast-message";
import {useAuth} from "@/security/AuthProvider";

export default function Register() {
  const router = useRouter();
  const auth = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();

  const handleRegister = async () => {
    try {
      await register({firstName, lastName, email, password});
      try {
        await auth.login({email, password});
        router.push('/preferences'); // Navigate to the Preferences screen
      } catch (e) {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Try logging in manually!',
        });
      }
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Try again!',
      });
    }
  };

  return (
    <>
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title} variant="titleLarge">
              Create an Account
            </Text>
            <TextInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
              mode="outlined"
            />
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
              onPress={handleRegister}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Register
            </Button>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text style={styles.link} onPress={() => router.push("/(auth)/login")}>
                Log in
              </Text>
            </Text>
          </Card.Content>
        </Card>
      </View>
    </>
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
