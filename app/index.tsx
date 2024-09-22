import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button, ScrollView, TextInput, StyleSheet, StatusBar } from 'react-native';
import { initializeFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { FirebaseProvider } from '@/root/firebaseContext';
import {AuthProvider} from "@/root/AuthContext"
import { initializeApp } from 'firebase/app';
import LoginScreen from '../components/LoginScreen';
import HomeScreen from '@/components/HomeScreen';
import SignUpScreen from '../components/SignUpScreen'
import FindMatchScreen from '../components/FindMatchScreen'
import DetailsScreen from '../components/DetailsScreen';
import ConnectionRequestsScreen from '@/components/ConnectionRequestsScreen';


// Initialize Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyBwwiZB8KX4Pt5PBeh70KPmx3cGTzgxpbk",
//   authDomain: "internfinder2.firebaseapp.com",
//   projectId: "internfinder2",
//   storageBucket: "internfinder2.appspot.com",
//   messagingSenderId: "23906885148",
//   appId: "1:23906885148:web:f6ce50a5a39fcca7ccc9d9",
//   measurementId: "G-9ESDEJJ617"
// };

// const app = initializeApp(firebaseConfig);

// const db = initializeFirestore(app, {
//   experimentalForceLongPolling: true
// })

export type RootStackParamList = {
  Login: undefined, // undefined because you aren't passing any params to the home screen
  Details: undefined,
  SignUp: undefined,
  Home: undefined,
  FindMatch: undefined,
  ConnectionRequests: undefined,
  Profile: { name: string }; 
};

const Stack = createStackNavigator<RootStackParamList>();

// Define a TypeScript type for the user object
type User = {
    id: string;
    name: string;
    email: string;
    kind: string;
};

const App = () => {
    return (
      <AuthProvider>
        <NavigationContainer independent={true}>
        <StatusBar hidden={true} />
          <Stack.Navigator initialRouteName="SignUp" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="FindMatch" component={FindMatchScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConnectionRequests" component={ConnectionRequestsScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10
    },
    userContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5
    }
});

export default App;
