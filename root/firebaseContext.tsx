import React, { createContext, useContext } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBwwiZB8KX4Pt5PBeh70KPmx3cGTzgxpbk",
    authDomain: "internfinder2.firebaseapp.com",
    projectId: "internfinder2",
    storageBucket: "internfinder2.appspot.com",
    messagingSenderId: "23906885148",
    appId: "1:23906885148:web:f6ce50a5a39fcca7ccc9d9",
    measurementId: "G-9ESDEJJ617"
  };

const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
const auth: Auth = getAuth(app);

const FirebaseContext = createContext<{ db: Firestore; auth: Auth } | null>(null);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <FirebaseContext.Provider value={{ db, auth }}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

