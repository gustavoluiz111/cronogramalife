import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const syncProfile = async (user) => {
        if (!user) { setUserProfile(null); return null; }
        const profileRef = ref(db, `users/${user.uid}/profile`);
        const snapshot = await get(profileRef);
        if (snapshot.exists()) {
            setUserProfile(snapshot.val());
            return { isNew: false };
        } else {
            const initialProfile = {
                email: user.email,
                nome: user.displayName || user.email?.split('@')[0] || 'Estudante',
                curso: null,
                createdAt: new Date().toISOString(),
            };
            await set(profileRef, initialProfile);
            setUserProfile(initialProfile);
            return { isNew: true };
        }
    };

    const signup = async (email, password, curso, nome) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Also update Firebase Auth displayName
        try {
            await firebaseUpdateProfile(user, { displayName: nome || email.split('@')[0] });
        } catch (_) {}

        const profileRef = ref(db, `users/${user.uid}/profile`);
        const initialProfile = {
            email: user.email,
            nome: nome?.trim() || email.split('@')[0],
            curso: curso || 'Não definido',
            createdAt: new Date().toISOString(),
        };
        await set(profileRef, initialProfile);
        setUserProfile(initialProfile);
        return userCredential;
    };

    const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        const userCredential = await signInWithPopup(auth, provider);
        const result = await syncProfile(userCredential.user);
        return { credential: userCredential, isNew: result?.isNew || false };
    };

    const updateUserProfile = async (updates) => {
        if (!currentUser) return;
        const profileRef = ref(db, `users/${currentUser.uid}/profile`);
        const newProfile = { ...(userProfile || {}), ...updates };
        await set(profileRef, newProfile);
        setUserProfile(newProfile);
    };

    const logout = () => signOut(auth);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                await syncProfile(user);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        signup,
        login,
        loginWithGoogle,
        updateUserProfile,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
