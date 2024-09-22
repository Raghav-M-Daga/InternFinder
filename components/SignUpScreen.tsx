import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Pressable
} from 'react-native';
import { useFirebase } from '@/root/firebaseContext';
import { doc, setDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from 'firebase/auth';
import { useAuth } from '../root/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Index from "../app/index"

type ProfileScreenNavigationProp = StackNavigationProp<
Index.RootStackParamList,
'Login'
>;

type Props = {
    navigation: ProfileScreenNavigationProp;
  };

export default function SignUpScreen({ navigation }: Props) {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [user, setUser] = useState<User | null>(null); 
  const { auth, db } = useAuth();

  const handleAuth = async () => {
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDocRef, { additionalInfo: '' });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      navigation.navigate('Details');
    } catch (error) {
      console.error('Error with authentication:', error);
    }
  };

  const handleClick = async () => {
    const newUser = { email, password };
    await addDoc(collection(db, 'users'), newUser);4
    onChangeEmail('');
    onChangePassword('');
  }
//   const [loggedIn, onLogin] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Welcome to Intern Finder</Text>
        <>
          <Text style={styles.regularText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
          <TextInput
            style={styles.inputBox}
            value={email}
            onChangeText={onChangeEmail}
            placeholder='email'
            placeholderTextColor={"black"}
            keyboardType={'email-address'}
          />
          <TextInput
            style={styles.inputBox}
            value={password}
            onChangeText={onChangePassword}
            placeholder={'password'}
            placeholderTextColor={"black"}
            keyboardType={'default'}
            secureTextEntry={true}
          />

      <Pressable style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.buttonText}>{isSignUp ? 'Switch to Login' : 'Switch to Sign-Up'}</Text>
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
    backgroundColor: 'gainsboro',
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

