import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Modal, Button } from 'react-native';
import { collection, getDocs, query, where, doc, updateDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/root/AuthContext';

interface ConnectionRequest {
  fromId: string;
  fromFirstName: string;
  fromLastName: string;
  fromContact: string;
  timestamp: any;
  toFirstName: string;
  toLastName: string,
  toContact: string,
  status: string;
}

const ConnectionRequestsScreen = () => {
  const { user, db } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<ConnectionRequest[]>([]);
  const [friends, setFriends] = useState<ConnectionRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ConnectionRequest | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchConnectionRequests = async () => {
      if (user) {
        // Incoming requests
        const incomingQuery = query(
          collection(db, 'users', user.uid, 'connectionRequests'),
          where('status', '==', 'pending')
        );
        const incomingSnapshot = await getDocs(incomingQuery);

        const incoming: ConnectionRequest[] = [];
        incomingSnapshot.forEach((doc) => {
          incoming.push(doc.data() as ConnectionRequest);
        });

        setIncomingRequests(incoming);

        // Outgoing requests
        const outgoingQuery = query(
          collection(db, 'sentRequests'),
          where('fromId', '==', user.uid)
        );
        const outgoingSnapshot = await getDocs(outgoingQuery);

        const outgoing: ConnectionRequest[] = [];
        outgoingSnapshot.forEach((doc) => {
          outgoing.push(doc.data() as ConnectionRequest);
        });

        setOutgoingRequests(outgoing);

        // Friends
        const friendsQuery = query(
          collection(db, 'users', user.uid, 'friends')
        );
        const friendsSnapshot = await getDocs(friendsQuery);

        const friendsList: ConnectionRequest[] = [];
        friendsSnapshot.forEach((doc) => {
          friendsList.push(doc.data() as ConnectionRequest);
        });

        setFriends(friendsList);
      }
    };

    fetchConnectionRequests();
  }, [user]);

  const handleRequestPress = (request: ConnectionRequest) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const handleAcceptPress = async () => {
    if (selectedRequest && user) {
      try {
        // Update request status to 'accepted'
        const requestRef = doc(db, 'users', user.uid, 'connectionRequests', selectedRequest.fromId);
        await updateDoc(requestRef, { status: 'accepted' });
  
        // Add to current user's friends collection
        const friendRef = doc(db, 'users', user.uid, 'friends', selectedRequest.fromId);
        await setDoc(friendRef, selectedRequest);
  
        // Add to selected user's friends collection
        const friendReverseRef = doc(db, 'users', selectedRequest.fromId, 'friends', user.uid);
        await setDoc(friendReverseRef, {
          fromId: user.uid,
          fromName: user.displayName,
          fromContact: user.email,
          toId: selectedRequest.fromId,
          toFirstName: selectedRequest.fromFirstName,
          toLastName: selectedRequest.fromLastName,
          toEmail: selectedRequest.fromContact,
          timestamp: new Date(),
          status: 'accepted'
        });
  
        setModalVisible(false);
      } catch (error) {
        console.error('Error accepting connection request:', error);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.header}>Connection Requests</Text>

      <Text style={styles.subHeader}>Incoming Requests</Text>
      <ScrollView>
        {incomingRequests.map((request, index) => (
          <Pressable
            key={index}
            onPress={() => handleRequestPress(request)}
            style={styles.requestContainer}
          >
            <Text style={styles.requestName}>{request.fromFirstName} {request.fromLastName}</Text>
            <Text>{request.fromContact}</Text>
            <Text>{new Date(request.timestamp.seconds * 1000).toLocaleString()}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.subHeader}>Outgoing Requests</Text>
      <ScrollView>
        {outgoingRequests.map((request, index) => (
          <Pressable
            key={index}
            onPress={() => handleRequestPress(request)}
            style={styles.requestContainer}
          >
            <Text style={styles.requestName}>{request.toFirstName} {request.toLastName}</Text>
            <Text>{request.toContact}</Text>
            <Text>{new Date(request.timestamp.seconds * 1000).toLocaleString()}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.subHeader}>Friends</Text>
      <ScrollView>
        {friends.map((friend, index) => (
          <Pressable
            key={index}
            onPress={() => handleRequestPress(friend)}
            style={styles.requestContainer}
          >
            <Text style={styles.requestName}>{friend.fromFirstName} {friend.fromLastName}</Text>
            <Text>{friend.fromContact}</Text>
            <Text>{new Date(friend.timestamp.seconds * 1000).toLocaleString()}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {selectedRequest && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Connection Request</Text>
              <Text>Name: {selectedRequest.fromFirstName} {selectedRequest.fromLastName}</Text>
              <Text>Contact: {selectedRequest.fromContact}</Text>
              <Text>Sent At: {new Date(selectedRequest.timestamp.seconds * 1000).toLocaleString()}</Text>
              <View style={styles.modalButtons}>
                <Button title="Close" onPress={() => setModalVisible(false)} />
                <Button title="Accept" onPress={handleAcceptPress} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  requestContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  requestName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default ConnectionRequestsScreen;
