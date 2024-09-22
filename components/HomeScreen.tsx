// screens/UserInfoScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Pressable, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Index from "../app/index";

type ProfileScreenNavigationProp = StackNavigationProp<
Index.RootStackParamList,
'Login'
>;

type Props = {
    navigation: ProfileScreenNavigationProp;
  };

type User = {
    id: string;
    firstName: string;
    lastName: string;
};


export default function UserInfoScreen({navigation}: Props) {

  return (
    <View style={styles.container}>
    <Pressable style={styles.button} onPress={() => navigation.navigate('Details')}>
      <Text style={styles.buttonText}>Go to Details</Text>
    </Pressable>
    <Pressable style={styles.button} onPress={() => navigation.navigate('FindMatch')}>
      <Text style={styles.buttonText}>Find Matches</Text>
    </Pressable>
    <Pressable style={styles.button} onPress={() => navigation.navigate('ConnectionRequests')}>
      <Text style={styles.buttonText}>Connection Requests</Text>
    </Pressable>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

