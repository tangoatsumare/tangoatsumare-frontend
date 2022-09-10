import { Image, StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import imageSource from '../assets/ocr-test.jpeg';
import cat from '../assets/wakeupcat.jpeg';
// import SelectableText from 'react-native-selectable-text';
// Imports the Google Cloud client library
// import vision from '@google-cloud/vision';
import { useState, useEffect } from 'react';
import { sendImageToCloudVisionApi } from '../utils/flashcard';
import { app } from '../firebase';
import { 
    getStorage,
    ref, 
    uploadBytesResumable, 
    uploadString,
    getDownloadURL
} from 'firebase/storage';
// https://www.npmjs.com/package/react-native-uuid
import uuid from 'react-native-uuid';

import {lookupJishoApi} from '../utils/jisho';
import { async } from '@firebase/util';
import axios from 'axios';

export const OCR = ({ route, navigation }) => {
    const storage = getStorage(app);
    const { image_uri, image_base64 } = route.params;
    const [ image, setImage ] = useState(image_uri);
    const [ cloudStoragePath, setCloudStoragePath ] = useState('');
    const [ responseText, setResponseText ] = useState('');
    const [ selectedText, setSelectedText ] = useState('');
    const [ resultFromDictionaryLookup, setResultFromDictionaryLookup ] = useState('');

    // send to cloud vision once components are mounted
    useEffect(() => {
        (async () => {
            try {
                const result = await sendImageToCloudVisionApi(image_base64);
                setResponseText(result);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);
    
    async function uploadImageAsync(uri) {
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });
      
        const fileRef = ref(storage, `testing/${uuid.v4()}`); // uuid for the photo object's name
        const result = await uploadBytesResumable(fileRef, blob);
      
        // We're done with the blob, close and release it
        blob.close();
      
        return await getDownloadURL(fileRef);
      }

    const uploadToFirebaseCloudStorage = async () => {
        try {
            const uploadURL = await uploadImageAsync(image);
            setCloudStoragePath(uploadURL);
        } catch (err) {
            console.log(err);
        }
    };

    // useEffect(() => {
    //     if (cloudStoragePath) {
    //         console.log(cloudStoragePath);
    //     }
    // }, [cloudStoragePath]);

    const handleSelectionChange = (e) => {
        if (responseText) {
            const start = e.nativeEvent.selection.start;
            const end = e.nativeEvent.selection.end;
            const selectedChunk = responseText.substring(start, end);
            setSelectedText(selectedChunk);
        }
    }

    useEffect(() => {
        (async () => {
            if (selectedText) {
                await receiveDictionaryInfo(selectedText);
            }
        })();
    }, [selectedText]);

    const receiveDictionaryInfo = async () => {
        try {
            let result = await lookupJishoApi(selectedText);
            setResultFromDictionaryLookup(result.toString());
        } catch (err) {
            console.log(err);
        }
    };

    const submitFlashCard = async () => {
        try {
            if (selectedText && responseText && resultFromDictionaryLookup && cloudStoragePath) {
                await uploadToFirebaseCloudStorage();
                const flashcard = {
                    target_word: selectedText,
                    context: responseText,
                    reading: '',
                    english_definition: [resultFromDictionaryLookup],
                    image: cloudStoragePath.toString(),
                    parts_of_speech: ''
                };
                console.log(flashcard);
    
                await axios.post(`https://tangoatsumare-api.herokuapp.com/api/flashcards`, { // put into .env
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: flashcard
                }).then(res => {
                    console.log('flashcard POSTed to the backend API');
                    // navigate user to his/her collection of cards
                    navigation.navigate("Home")
                }).catch(err => {
                    console.log(err);
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <ScrollView 
        contentContainerStyle={{ alignItems: "center", justifyContent: "center"}}
        style={styles.container}
        >
            <Image 
                source={{ uri: image }} 
                style={styles.logo} 
            />
            <View 
                style={styles.responseContainer}
            >
                <Text>Select a word to learn</Text>
                <TextInput
                    style={styles.responseText}
                    onSelectionChange={handleSelectionChange}
                    editable={false}
                    multiline={true}
                >
                    {responseText}
                </TextInput>
            </View>
            <View style={styles.userTextSelection}>
                <Text>You've selected</Text>
                <Text style={styles.responseText}>{selectedText}</Text>
            </View>
            {/* <View style={styles.testing}> */}
            {/* <Button
                mode="contained"
                onPress={receiveDictionaryInfo}
                style={styles.button}
            >
                Look up the Dictionary
            </Button> */}
            <View style={styles.dictionaryLookup}></View>
            <Text>Here is the dictionary lookup result:</Text>
            <Text style={styles.lookupText}>{resultFromDictionaryLookup}</Text>
            {/* <Button
                mode="contained"
                onPress={uploadToFirebaseCloudStorage}
                style={styles.button}
            >
                Upload to Firebase Cloud Storage
            </Button> */}
            <Button 
                mode="contained"
                style={styles.button}
                onPress={submitFlashCard}
            >
                Send
            </Button>
            {/* <View>
                <Text>
                    1. upload photo to cloud storage
                </Text>
                <Text>
                    2. if 1 is successful, gather everything
                </Text>
                <Text>
                    3. send HTTP POST request to backend API
                </Text>
            </View> */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    },
    logo: {
        width: 305,
        height: 159
    },
    button: {
        margin: 20,
    },
    responseContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    responseText: {
        fontSize: 50,
        // padding: 20
    },
    userTextSelection: {
        alignItems: 'center',
        justifyContent: 'center',
        // padding: 20,
        fontSize: 50,
    },
    testing: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dictionaryLookup: {
        padding: 20,
        fontSize: 30,
    },
    lookupText: {
        fontSize: 20,
        padding: 20
    }
  });
  