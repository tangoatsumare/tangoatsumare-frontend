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
    preprocessFlashcards,
    getTagsToFlashcardsIdObject
} from '../utils/helper';
import { 
    SRSTangoFlashcard,
    getReviewableSRSFlashcards
 } from "../utils/supermemo";

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
    
    const [flashcardsMaster, setFlashcardsMaster] = useState<object[]>([]);
    const [flashcardsCurated, setFlashcardsCurated] = useState<object[]>([]);
    const [flashcardsCollection, setFlashcardsCollection] = useState<object[]>([]);
    const [flashcardsFeed, setFlashcardsFeed] = useState<object[]>([]);
    const [tagsToFlashcards, setTagsToFlashcards] = useState<object>({});

    
    // to implement the checking of user is authenticated
    // then set the states of current user's set of flashcards
    const auth = getAuth();
    const [flashcardsOfCurrentUser, setFlashcardsOfCurrentUser] = useState([]);
    const [SRSFlashcardsOfCurrentUser, setSRSFlashcardsOfCurrentUser] = useState<SRSTangoFlashcard[]>([]);

    ///
    const [ flashcardsReviewable, setFlashcardsReviewable ] = useState([]);
    const [ metrics, setMetrics ] = useState({
        new: 0,
        due: 0
    });

    async function updateSRSFlashcards(requestBody) {
        try {
            await HTTPRequest.updateFlashcardsSRSProperties(requestBody);
            const SRSFlashcards = await HTTPRequest.getSRSFlashcardsByUser(currentUser.uid)
            setSRSFlashcardsOfCurrentUser(SRSFlashcards);
            const reviewables = getReviewableSRSFlashcards(SRSFlashcards);
            setFlashcardsReviewable(reviewables);
            console.log('SRS flashcards updated!');
        } catch (err) {
            console.log(err);
        }
    }

    async function updateAppStates() {
        try {
            let flashcardsData = await HTTPRequest.getFlashcards();
            const usersAll = await HTTPRequest.getUsers();
            const tagsData = await HTTPRequest.getTags();

            // pre-processing
            flashcardsData = preprocessFlashcards(flashcardsData, usersAll);
            const result: any[] = flashcardsData.reverse();

            setFlashcards(result);
            setUsers(usersAll);
            setTags(tagsData);
            setFlashcardsOfCurrentUser(result.filter(flashcard => flashcard["created_by"] === currentUser.uid));
            
            setTagsToFlashcards(getTagsToFlashcardsIdObject(tagsData));
            setFlashcardsMaster(result);
            setFlashcardsFeed(result);
            setFlashcardsCollection(result.filter(flashcard => flashcard["created_by"] === currentUser.uid));

            const SRSFlashcards = await HTTPRequest.getSRSFlashcardsByUser(currentUser.uid);
            setSRSFlashcardsOfCurrentUser(SRSFlashcards);
            const reviewables = getReviewableSRSFlashcards(SRSFlashcards);
            setFlashcardsReviewable(reviewables);
            if (reviewables) {
                const newCards = reviewables.filter(card => card.counter === 0).length;
                const dueCards = reviewables.filter(card => card.counter !== 0).length;
                setMetrics({
                    new: newCards,
                    due: dueCards
                });
            }
        } catch(err) {
            console.log(err);
        }
    }

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
            console.log("changing auth state");
            // setAuthLoading(false);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        (async () => {
            console.log("running");
            if (currentUser) {
                // data to fetch as global context
                await updateAppStates();
            }
        })();
    }, [currentUser]);

    useEffect(() => {
        if (flashcardsReviewable) {
            const newCards = flashcardsReviewable.filter(card => card.counter === 0).length;
            const dueCards = flashcardsReviewable.filter(card => card.counter !== 0).length;
            
            setMetrics({
                new: newCards,
                due: dueCards
            });

        }
    }, [flashcardsReviewable]);


    useEffect(() => {
        if (
            // currentUser || 
            flashcards && users && tags
             && SRSFlashcardsOfCurrentUser && flashcardsOfCurrentUser
             && flashcardsCollection && flashcardsFeed && flashcardsCurated
             && tagsToFlashcards && flashcardsMaster
             ) {
            setLoading(false);
        }
    }, [flashcards, users, tags]);

    const value = {
        flashcards,
        setFlashcards,
        users,
        setUsers,
        tags,
        setTags,
        flashcardsOfCurrentUser,
        SRSFlashcardsOfCurrentUser,
        metrics,
        flashcardsReviewable,
        setFlashcardsReviewable,
        updateSRSFlashcards,
        flashcardsMaster,
        setFlashcardsMaster,
        flashcardsCurated,
        setFlashcardsCurated,
        flashcardsCollection,
        setFlashcardsCollection,
        flashcardsFeed,
        setFlashcardsFeed,
        tagsToFlashcards,
        setTagsToFlashcards,
        loading,
        updateAppStates,
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
