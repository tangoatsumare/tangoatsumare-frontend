import { async } from '@firebase/util';
import React, { useContext, useState, useEffect } from 'react';
import { HTTPRequest } from '../utils/httpRequest';

const TangoContext = React.createContext();

export function useTangoContext() {
    return useContext(TangoContext);
}

export function TangoProvider({ children}) {
    const [loading, setLoading] = useState(true);
    const [flashcards, setFlashcards] = useState([]);

    useEffect(() => {
        (async () => {
            let flashcardsData = await HTTPRequest.getFlashcards();
            setFlashcards(flashcardsData);
            setLoading(false);
        })();
    }, []);

    const value = {
        flashcards,
        setFlashcards,
        test: 'Hello World'
    };

    return (
        <TangoContext.Provider value={value}>
            {!loading && children}
        </TangoContext.Provider>
    );
}
