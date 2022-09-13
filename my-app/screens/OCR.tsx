// import { useNavigation} from "@react-navigation/core";
import { Image, StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import imageSource from '../assets/ocr-test.jpeg';
import cat from '../assets/wakeupcat.jpeg';
// import SelectableText from 'react-native-selectable-text';
// Imports the Google Cloud client library
// import vision from '@google-cloud/vision';
import React, { useState, useEffect } from 'react';
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
    const [ sentenceEditMode, setSentenceEditMode ] = useState(false);
    const [ cardSubmissionBtnIsClick, setCardSubmissionBtnIsClick ] = useState(false);
    const [ cardIsSubmitted, setCardIsSubmitted ] = useState(false);
    const [ cardSubmissionError, setCardSubmissionError ] = useState(false);

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

    const handleSelectionChange = (e) => {
        if (responseText) {
            const start = e.nativeEvent.selection.start;
            const end = e.nativeEvent.selection.end;
            const selectedChunk = responseText.substring(start, end);
            setSelectedText(selectedChunk);
        }
    }

    useEffect(() => {
        async function fetchData () {
            await receiveDictionaryInfo(selectedText);
        };
        if (selectedText !== '') fetchData(); 
        else setResultFromDictionaryLookup('');
    }, [selectedText]);

    const receiveDictionaryInfo = async () => {
        try {
            let result = await lookupJishoApi(selectedText);
            setResultFromDictionaryLookup(result[0].toString());
        } catch (err) {
            console.log(err);
        }
    };

    const submitFlashCard = async () => {
        try {
            if (selectedText && responseText && resultFromDictionaryLookup) {
                // await uploadToFirebaseCloudStorage();
                console.log('ok')
                setCardSubmissionBtnIsClick(true);
            } else console.log('hmmm....');
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        (async () => { 
            if (cardSubmissionBtnIsClick) { // if card submission button is clicked, execute photo upload
                await uploadToFirebaseCloudStorage();
            }
        })();
    }, [cardSubmissionBtnIsClick]);

    useEffect(() => {
        (async () => {
            if (cloudStoragePath) { // if photo is successfully uploaded to firebase, execute the flashcard POST request
                const flashcard = {
                    target_word: selectedText,
                    context: responseText,
                    reading: '',
                    english_definition: [resultFromDictionaryLookup],
                    image: cloudStoragePath,
                    parts_of_speech: ''
                };
                try {
                    await fetch(`https://tangoatsumare-api.herokuapp.com/api/flashcards`, { // put into .env
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(flashcard)
                    });
                    console.log('flashcard POSTed to the backend API');
                    setCardIsSubmitted(true);
                } catch (err) {
                    console.log(err);
                    setCardSubmissionError(true);
                }
            }
        })();
    }, [cloudStoragePath]);

    // read layout from the DOM and synchronously re-render
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                if (!cardSubmissionBtnIsClick) {
                    return (
                        <Button 
                            icon="send" 
                            onPress={submitFlashCard}
                        >Send</Button>
                    );
                }
            }
        })
    })

    return (
        <ScrollView contentContainerStyle={styles.container}>
            { !cardSubmissionBtnIsClick ? 
            <>
                <Image 
                    source={{ uri: image }} 
                    style={styles.image}
                    resizeMode="contain"
                />
                <View 
                    style={styles.responseContainer}
                >
                    <View style={styles.responseTitleContainer}>
                        <Text style={styles.responseTitle}>Select a word to learn</Text>
                        <Button 
                            icon={sentenceEditMode ? "check-bold" : "cog"}
                            textColor={sentenceEditMode ? "green" : "purple"}
                            onPress={() => setSentenceEditMode((prev) => !prev)}
                        >
                            {sentenceEditMode ? "done" : "edit"}
                        </Button>
                    </View>
                    <TextInput
                        style={sentenceEditMode ? styles.responseTextEditMode : styles.responseText}
                        onSelectionChange={handleSelectionChange}
                        onChangeText={(text) => setResponseText(text)}
                        editable={sentenceEditMode ? true : false}
                        multiline={true}
                    >
                        {responseText}
                    </TextInput>
                </View>
                <View style={styles.userTextSelection}>
                    <Text>You've selected</Text>
                    <Text style={styles.responseText}>{selectedText}</Text>
                </View>
                <Text>Here is the dictionary lookup result:</Text>
                <Text style={styles.lookupText}>{resultFromDictionaryLookup}</Text>
            </>
                :
            !cardIsSubmitted && !cardSubmissionError ? 
                <Text>executing card submission</Text> : 
                cardIsSubmitted && !cardSubmissionError ?
                <View style={styles.submissionContainer}>
                    <Text>Submit successfully!</Text>
                    <Button
                        icon="check-circle-outline" 
                        labelStyle={{fontSize: 150}}
                        textColor="green"
                    ></Button>
                    <Button 
                        mode="outlined"
                        textColor="black"
                        style={styles.button}
                            onPress={()=>{
                                navigation.navigate("Home")
                            }}
                    >Return Home</Button>
                </View> :
                <View>
                    <Text>Oh no.. something went wrong!</Text>
                    <Text>Try again or contact the dev team 🙇 </Text>
                    <Button
                        icon="close-circle-outline" 
                        labelStyle={{fontSize: 150}}
                        textColor="red"
                    ></Button>
                    <Button 
                        mode="outlined"
                        textColor="black"
                        style={styles.button}
                            onPress={()=>{
                                navigation.navigate("Home")
                            }}
                    >Return Home</Button>
                </View>
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
        width: 305,
        height: 159,
        margin: 20
    },
    button: {
        margin: 20,
    },
    responseContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    responseTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    responseTitle: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderStyle: 'solid',
        borderRadius: 10,
        overflow: 'hidden'
    },
    responseText: {
        fontSize: 50,
        margin: 20
    },
    responseTextEditMode: {
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        margin: 20
    },
    userTextSelection: {
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 50,
    },
    dictionaryLookup: {
        fontSize: 30,
    },
    lookupText: {
        fontSize: 20,
        padding: 20
    },
    submissionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
  });
  