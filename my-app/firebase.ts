import * as firebase from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import Constants from 'expo-constants';

const firebaseConfig = {
    apiKey: Constants.manifest?.extra?.firebaseApiKey,
    authDomain: Constants.manifest?.extra?.firebaseAuthDomain,
    projectId: Constants.manifest?.extra?.firebaseProjectId,
    storageBucket:  Constants.manifest?.extra?.firebaseStorageBucket,
    messagingSenderId: Constants.manifest?.extra?.firebaseMessagingSenderId,
    appId: Constants.manifest?.extra?.firebaseAppId,
}

firebase.initializeApp(firebaseConfig);

export default firebase;
export const getFirebaseAuth = (): Auth => getAuth();
