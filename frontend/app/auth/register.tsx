import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Card, Text, TextInput, useTheme} from 'react-native-paper';
import {useRouter} from "expo-router";
import {register} from "@/api";
import Toast from "react-native-toast-message";

export default function Register() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();

  const handleRegister = () => {
    register({firstName: firstName, lastName: lastName, email: email, password: password}).then(r => {
      router.navigate('/');
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'You can log in!',
      });
    }).catch(e => {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Try again!',
      });
    });
  };

  return (
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
            Already have an account? <Text style={styles.link} onPress={() => router.push("/auth/login")}>Log in</Text>
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