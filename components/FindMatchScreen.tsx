import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Modal, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth, AuthProvider } from '../root/AuthContext';
import * as Index from "../app/index"
import * as Location from 'expo-location';
import { getDocs, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { haversineDistance, Coordinates } from '@/root/HaversineFormula';
import RNPickerSelect from 'react-native-picker-select';

type ProfileScreenNavigationProp = StackNavigationProp<
Index.RootStackParamList,
'Login'
>;

type Props = {
    navigation: ProfileScreenNavigationProp;
  };

interface User {
id: string;
firstName: string;
lastName: string
age: number;
gender: string;
ethnicity: string,
street: string,
city: string,
state: string,
zip: string,
latitude: string,
longitude: string
distance?: number,
uid?: string
};

export default function FindMatch({navigation}: Props) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<User | null>(null);
    const { user, db } = useAuth();
    const [currLat, setCurrLat] = useState(null);
    const [currLong, setCurrLong] = useState(null);
    const [matches, setMatches] = useState<User[]>([]);
    const [proximity, setProximity] = useState<string | null>(null);
    const [gender, setGender] = useState<string | null>(null);
    const [ethnicity, setEthnicity] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurrentUserLocation = async () => {
          if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const currUserData = userDoc.data();
              setCurrLat(currUserData.latitude);
              setCurrLong(currUserData.longitude);
            }
          }
        };
    
        fetchCurrentUserLocation();
      }, [user, db]);

      useEffect(() => {
        const fetchUsers = async () => {
          const querySnapshot = await getDocs(collection(db, 'users'));
          const users: User[] = [];
    
          querySnapshot.forEach((doc) => {
            const data = doc.data() as User;
            data.id = doc.id;
            users.push(data);
          });

          const filteredUsers = users.filter((currUser) => currUser.id !== user?.uid);
    
          if (currLat && currLong) {
            const currentUserCoords: Coordinates = {
              latitude: parseFloat(currLat),
              longitude: parseFloat(currLong),
            };
    
            filteredUsers.forEach((user) => {
              const userCoords: Coordinates = {
                latitude: parseFloat(user.latitude),
                longitude: parseFloat(user.longitude),
              };
    
              user.distance = haversineDistance(currentUserCoords, userCoords);
            });
    
            let sortedUsers = filteredUsers.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

            if (gender) {
              sortedUsers = sortedUsers.filter(user => user.gender === gender);
            }
            if (ethnicity) {
              sortedUsers = sortedUsers.filter(user => user.ethnicity === ethnicity);
            }
            if (proximity) {
              const maxDistance = parseInt(proximity, 10);
              sortedUsers = sortedUsers.filter(user => (user.distance ?? 0) <= maxDistance);
            }
    
            setMatches(sortedUsers);
          }
        };
    
        fetchUsers();
      }, [db, currLat, currLong]);

      const sendConnectionRequest = async (match: User ) => {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.data();
      
          if (match) {
          const matchDocRef = doc(db, 'users', match.id, 'connectionRequests', user.uid);
          const senderDocRef = doc(db, 'users', user.uid, 'sentRequests', match.id)
          await setDoc(matchDocRef, {
            fromId: user.uid,
            fromFirstName: userData?.firstName,
            fromLastName: userData?.lastName,
            fromContact: userData?.contact,
            toId: match.id,
            toFirstName: match.firstName,
            toLastName: match.lastName,
            timestamp: new Date(),
            status: "pending"
          });
          await setDoc(senderDocRef, {
            fromId: user.uid,
            fromFirstName: userData?.firstName,
            fromLastName: userData?.lastName,
            fromContact: userData?.contact,
            toId: match.id,
            toFirstName: match.firstName,
            toLastName: match.lastName,
            timestamp: new Date(),
            status: "pending"
          })
        }
      
          // Show success message or handle UI updates
        }
      };
      
      // Inside the Modal Content:
      {selectedMatch && (
        <Button title="Connect" onPress={() => sendConnectionRequest(selectedMatch)} />
      )}
      
      

      const openModal = (match: User) => {
        setSelectedMatch(match);
        setModalVisible(true);
      };
    
      const closeModal = () => {
        setSelectedMatch(null);
        setModalVisible(false);
      };
    

      return (
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>People Near You</Text>

          <View style={{ margin: 10 }}>
            <Text>Proximity (in miles)</Text>
            <RNPickerSelect
              onValueChange={(value) => setProximity(value)}
              items={[
                { label: '10 miles', value: '10' },
                { label: '20 miles', value: '20' },
                { label: '50 miles', value: '50' },
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: "Select Proximity", value: null }}
            />
            <Text>Gender</Text>
            <RNPickerSelect
              onValueChange={(value) => setGender(value)}
              items={[
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: "Select Gender", value: null }}
            />
            <Text>Ethnicity</Text>
            <RNPickerSelect
              onValueChange={(value) => setEthnicity(value)}
              items={[
                { label: 'Asian', value: 'Asian' },
                { label: 'Black', value: 'Black' },
                { label: 'Hispanic', value: 'Hispanic' },
                { label: 'White', value: 'White' },
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: "Select Ethnicity", value: null }}
            />
        </View> 
        <ScrollView style={styles.container}>
          <Text style={styles.heading}>People Near You</Text>
          {matches.map((match) => (
            <Pressable key={match.id} style={styles.item} onPress={() => openModal(match)}>
              <Text style={styles.itemText}>
                {match.firstName} {match.lastName}, {match.age}, {match.gender}
              </Text>
              <Text style={styles.distanceText}>Distance: {match.distance?.toFixed(2)} miles</Text>
            </Pressable>
          ))}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeModal}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                {selectedMatch && (
                  <>
                    <Text style={styles.modalTitle}>{selectedMatch.firstName} {selectedMatch.lastName}</Text>
                    <Text>Address: {selectedMatch.street}, {selectedMatch.city}, {selectedMatch.state} {selectedMatch.zip}</Text>
                    <Text>Gender: {selectedMatch.gender}</Text>
                    <Text>Age:  {selectedMatch.age}</Text>
                    <Text>Ethnicity:  {selectedMatch.ethnicity}</Text>
                  </>
                )}
                <View style={styles.modalButtonContainer}>
                    <Pressable style={styles.modalButton} onPress={closeModal}>
                        <Text style={styles.modalButtonText}>Close</Text>
                    </Pressable>
                    {selectedMatch ? (  
                    <Pressable style={styles.modalButton} onPress={() => sendConnectionRequest(selectedMatch)}>
                        <Text style={[styles.modalButtonText, styles.boldText]}>Connect</Text>
                    </Pressable>
                    ): (
                      <Text style={[styles.modalButtonGrey]}>Connect</Text>
                    )}
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
        </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    item: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    itemText: {
      fontSize: 18,
    },
    distanceText: {
      fontSize: 14,
      color: '#888',
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      width: '80%',
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
      },
      modalButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      modalButtonText: {
        fontSize: 18,
        color: "blue"
      },
      modalButtonGrey: {
        fontSize: 18,
        color: "grey"
      },
      boldText: {
        fontWeight: 'bold',
      },
  });

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30,
      backgroundColor: 'white',
      marginBottom: 10,
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'gray',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30,
      backgroundColor: 'white',
      marginBottom: 10,
    },
  });