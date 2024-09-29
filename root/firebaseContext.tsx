import React, { createContext, useContext } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

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

