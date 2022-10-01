import React, { useContext, useState, useEffect, useRef } from 'react';
import { HTTPRequest } from '../utils/httpRequest';
import {
    preprocessFlashcards,
    getTagsToFlashcardsIdObject
} from '../utils/helper';
import { 
    SRSTangoFlashcard,
    getReviewableSRSFlashcards
 } from "../utils/supermemo";
import { useAuthContext } from './AuthContext';
import { ActivityIndicator } from 'react-native-paper';

const TangoContext = React.createContext();

export function useTangoContext() {
    return useContext(TangoContext);
}

export function TangoProvider({ children }) {
    const { currentUser } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [flashcards, setFlashcards] = useState([]);
    const [users, setUsers] = useState([]);
    const [tags, setTags] = useState([]);
    const [flashcardsMaster, setFlashcardsMaster] = useState<object[]>([]);
    const [flashcardsCurated, setFlashcardsCurated] = useState<object[]>([]);
    const [flashcardsCollection, setFlashcardsCollection] = useState<object[]>([]);
    const [flashcardsFeed, setFlashcardsFeed] = useState<object[]>([]);
    const [tagsToFlashcards, setTagsToFlashcards] = useState<object>({});

    // to implement the checking of user is authenticated
    // then set the states of current user's set of flashcards
    const [flashcardsOfCurrentUser, setFlashcardsOfCurrentUser] = useState([]);
    const [SRSFlashcardsOfCurrentUser, setSRSFlashcardsOfCurrentUser] = useState<SRSTangoFlashcard[]>([]);
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

            const currentUserFlashcards = result.filter(flashcard => flashcard["created_by"] === currentUser.uid);
            setFlashcardsOfCurrentUser(currentUserFlashcards);
            
            setTagsToFlashcards(getTagsToFlashcardsIdObject(tagsData));
            setFlashcardsMaster(result);
            setFlashcardsFeed(result);
            setFlashcardsCollection(currentUserFlashcards);

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

    useEffect(() => {
        (async () => {
            console.log("running");
            if (currentUser) {
                // data to fetch as global context
                await updateAppStates();
                setLoading(false);
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
        updateAppStates
    };

    return (
        <TangoContext.Provider value={value}>
            {loading && 
                <ActivityIndicator
                    style={{flex:1, justifyContent: 'center', alignItems: 'center'}}
                />
            }
            {!loading && children}
        </TangoContext.Provider>
    );
}
