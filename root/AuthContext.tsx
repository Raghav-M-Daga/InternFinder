// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBwwiZB8KX4Pt5PBeh70KPmx3cGTzgxpbk",
    authDomain: "internfinder2.firebaseapp.com",
    projectId: "internfinder2",
    storageBucket: "internfinder2.appspot.com",
    messagingSenderId: "23906885148",
    appId: "1:23906885148:web:f6ce50a5a39fcca7ccc9d9",
    measurementId: "G-9ESDEJJ617"
  };

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
const auth = getAuth(app);

const AuthContext = createContext<{ user: User | null; db: any; auth: any } | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, db, auth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
