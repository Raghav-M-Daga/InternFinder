// screens/UserInfoScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Pressable, FlatList } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useAuth } from '../root/AuthContext';
import RNPickerSelect from 'react-native-picker-select';
import { StackNavigationProp } from '@react-navigation/stack';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { geocodeAddress } from '@/root/GeoCode';
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [duration, setDuration] = useState('');
  const { user, db } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setContact(data.contact || '');
          setAge(data.age || '');
          setGender(data.gender || '');
          setEthnicity(data.ethnicity || '');
          setStreet(data.street || '');
          setCity(data.city || '');
          setState(data.state || '');
          setZip(data.zip || '');
          setPhoneNumber(data.phoneNumber || '');
          setDuration(data.duration || '');
        }
      }
    };
    fetchUserDetails();
  }, [user]);

  const updateUserDocument = async () => {
    if (user) {
      const fullAddress = `${street}, ${city}, ${state}, ${zip}`;
      const { latitude, longitude } = await geocodeAddress(fullAddress);
      const userDocRef = doc(db, 'users', user.uid);
      const updatedFields = {
        firstName,
        lastName,
        contact,
        age,
        gender,
        ethnicity,
        latitude,
        longitude,
        street,
        city,
        state,
        zip, 
        phoneNumber,
        duration
      };
      try {
        await updateDoc(userDocRef, updatedFields);
        console.log('Document successfully updated!');
      } catch (error) {
        console.error('Error updating document:', error);
      }
    } else {
      console.error('No user is logged in');
    }
    navigation.navigate("Home");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.label}>First Name:</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

      <Text style={styles.label}>Last Name:</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

      <Text style={styles.label}>Age:</Text>
      <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />

      <Text style={styles.label}>Preferred Contact:</Text>
      <TextInput style={styles.input} value={contact} onChangeText={setContact} />

      {/* <Text style={styles.label}>Gender:</Text>
      <TextInput style={styles.input} value={gender} onChangeText={setGender} /> */}

      <Text style={styles.label}>Gender:</Text>
      <RNPickerSelect
        onValueChange={(value) => setGender(value)}
        items={[
          { label: 'Select Gender', value: '' },
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' },
          { label: 'Other', value: 'Other' },
          { label: 'Prefer not to say', value: 'Prefer not to say' }
        ]}
        style={pickerSelectStyles}
        placeholder={{}}
        value={gender}
      />

      <Text style={styles.label}>Ethnicity:</Text>
      <RNPickerSelect
        onValueChange={(value) => setEthnicity(value)}
        items={[
          { label: 'Select Ethnicity', value: '' },
          { label: 'Asian', value: 'Asian' },
          { label: 'Black or African American', value: 'Black or African American' },
          { label: 'Hispanic or Latino', value: 'Hispanic or Latino' },
          { label: 'White', value: 'White' },
          { label: 'Other', value: 'Other' }
        ]}
        style={pickerSelectStyles}
        placeholder={{}}
        value={ethnicity}
      />

      <Text style={styles.label}>Internship Address:</Text>
      <TextInput style={styles.input} value={street} onChangeText={setStreet} placeholder="Street" />
      <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" />

      <RNPickerSelect
        onValueChange={(value) => setState(value)}
        items={[
          { label: 'Select State', value: '' },
          { label: 'CA', value: 'California' },
          { label: 'TX', value: 'Texas' },
          { label: 'NY', value: 'New York' },
          { label: 'Other', value: 'Other' }
        ]}
        style={pickerSelectStyles}
        placeholder={{}}
        value={state}
      />
      <TextInput style={styles.input} value={zip} onChangeText={setZip} placeholder="Zip Code" keyboardType="numeric" />

      <Text style={styles.label}>Phone Number (will not be shared):</Text>
      <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />

      <Text style={styles.label}>Internship Duration (weeks):</Text>
      <TextInput style={styles.input} value={duration} onChangeText={setDuration} keyboardType='numeric' />

      <Pressable style={styles.button} onPress={updateUserDocument}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 90
  },
  label: {
    marginTop: 20,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 8,
  },
  selector: {
    height: 30,
    borderColor: "pink",
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 8,
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
    fontSize: 18,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 30,
    borderColor: "pink",
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 30,
    borderColor: "pink",
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 8,
    color: 'black',
    paddingRight: 30,  // to ensure the text is never behind the icon
  },
});

