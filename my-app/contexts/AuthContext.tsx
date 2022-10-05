import React, { useContext, useState, useEffect } from 'react';
import { 
    getAuth,
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut,
} from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuthContext() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const auth = getAuth();
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState();
    const [registrationMode, setRegistrationMode] = useState(false);
    const [registrationIsReady, setRegistrationIsReady] = useState(false);
    
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        signup,
        logout,
        registrationMode,
        setRegistrationMode,
        registrationIsReady,
        setRegistrationIsReady,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
