import { 
    GOOGLE_FIREBASE_API_KEY,
    GOOGLE_FIREBASE_AUTH_DOMAIN,
    GOOGLE_FIREBASE_PROJECT_ID,
    GOOGLE_FIREBASE_STORAGE_BUCKET,
    GOOGLE_FIREBASE_MESSAGING_SENDER_ID,
    GOOGLE_FIREBASE_APP_ID,
} from '@env';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: GOOGLE_FIREBASE_API_KEY,
    authDomain: GOOGLE_FIREBASE_AUTH_DOMAIN,
    projectId: GOOGLE_FIREBASE_PROJECT_ID,
    storageBucket: GOOGLE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: GOOGLE_FIREBASE_MESSAGING_SENDER_ID,
    appId: GOOGLE_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig);

/* 
https://stackoverflow.com/questions/70398442/metro-has-encountered-an-error-while-trying-to-resolve-module-firebase
*/