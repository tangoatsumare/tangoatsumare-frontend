import React, { useContext, useState, useEffect } from 'react';
import { HTTPRequest } from '../utils/httpRequest';
// import { auth } from 'firebase/auth';
import { 
    getAuth,
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut,
} from 'firebase/auth';
import {
    filterOutInappropriateFlashcards,
    filterOutDeletedFlashcardsFromFlashcards,
    formatFlashcardRelatedUserDetails,
} from '../utils/helper';

const TangoContext = React.createContext();

export function useTangoContext() {
    return useContext(TangoContext);
}

export function TangoProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [flashcards, setFlashcards] = useState([]);
    const [users, setUsers] = useState([]);
    const [tags, setTags] = useState([]);
    const [currentUser, setCurrentUser] = useState();
    
    // to implement the checking of user is authenticated
    // then set the states of current user's set of flashcards
    const auth = getAuth();
    const [flashcardsOfCurrentUser, setFlashcardsOfCurrentUser] = useState([]);

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
        (async () => {
            // data to fetch as global context
            let flashcardsData = await HTTPRequest.getFlashcards();
            const usersAll = await HTTPRequest.getUsers();
            const tagsData = await HTTPRequest.getTags();

            // pre-processing
            flashcardsData = filterOutInappropriateFlashcards(flashcardsData);
            flashcardsData = filterOutDeletedFlashcardsFromFlashcards(flashcardsData);

            const formattedFlashcards = formatFlashcardRelatedUserDetails(flashcardsData, usersAll);
            const result: any[] = formattedFlashcards.reverse();

            setFlashcards(result);
            setUsers(usersAll);
            setTags(tagsData);
        })();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            // setLoading(false);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (currentUser && flashcards) {
            setFlashcardsOfCurrentUser(flashcards.filter(flashcard => flashcard["created_by"] === currentUser.uid));
        }
    }, [currentUser, flashcards]);

    useEffect(() => {
        if (currentUser && flashcards && users && tags) {
            setLoading(false);
        }
    }, [currentUser, flashcards, users, tags]);

    const value = {
        flashcards,
        setFlashcards,
        users,
        setUsers,
        tags,
        setTags,
        flashcardsOfCurrentUser,

        currentUser,
        login,
        signup,
        logout,
    };

    return (
        <TangoContext.Provider value={value}>
            {!loading && children}
        </TangoContext.Provider>
    );
}
