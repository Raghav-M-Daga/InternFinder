import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Pressable
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Index from "../app/index"

type ProfileScreenNavigationProp = StackNavigationProp<
Index.RootStackParamList,
'Login'
>;

type Props = {
    navigation: ProfileScreenNavigationProp;
  };

export default function LoginScreen({ navigation }: Props) {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const handleClick = () => {
    if (email == "ragi" && password == "daga") {
        navigation.navigate('Details');
        onChangeEmail("");
        onChangePassword("");
    }
  }
  const signUpClick = () => {
    navigation.navigate("SignUp")
  }
//   const [loggedIn, onLogin] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Welcome to Intern Finder</Text>
        <>
          <Text style={styles.regularText}>Login to continue </Text>
          <TextInput
            style={styles.inputBox}
            value={email}
            onChangeText={onChangeEmail}
            placeholder={'email'}
            keyboardType={'email-address'}
          />
          <TextInput
            style={styles.inputBox}
            value={password}
            onChangeText={onChangePassword}
            placeholder={'password'}
            keyboardType={'default'}
            secureTextEntry={true}
          />
          <Pressable onPress={() => handleClick()} style={styles.button}>
            <Text style={styles.buttonText}>Login!</Text>
          </Pressable>
          <Pressable onPress={() => signUpClick()} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up!</Text>
          </Pressable>
        </>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    padding: 40,
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
  },
  regularText: {
    fontSize: 24,
    padding: 20,
    marginVertical: 8,
    color: 'black',
    textAlign: 'center',
  },
  inputBox: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderColor: 'black',
    backgroundColor: 'yellow',
  },
  button: {
    fontSize: 22,
    padding: 15,
    marginVertical: 12,
    margin: 90,
    backgroundColor: 'violet',
    borderWidth: 2,
    borderRadius: 50,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    alignItems: 'center',
    fontSize: 25,
  },
});

