// import { useNavigation} from "@react-navigation/core";
import { Image, StyleSheet, TextInput, View, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { Button, Text, Chip } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import { sendImageToCloudVisionApi } from '../utils/flashcard';
import app from '../firebase';
import { 
    getStorage,
    ref, 
    uploadBytesResumable,
    getDownloadURL
} from 'firebase/storage';
// https://www.npmjs.com/package/react-native-uuid
import uuid from 'react-native-uuid';

import {lookupJishoApi} from '../utils/jisho';
import { async } from '@firebase/util';
import axios from 'axios';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import dayjs from 'dayjs';
import { initializeSRSFlashcard, TangoFlashcard } from '../utils/supermemo';
import Icon from 'react-native-vector-icons/Feather';

interface OCRProps {
    route: any;
    navigation: any;
}

export const OCR = ({ route, navigation }: OCRProps) => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const storage = getStorage(app);
    const { image_uri, image_base64 } = route.params;
    const [ image, setImage ] = useState<string>(image_uri);
    const [ cloudStoragePath, setCloudStoragePath ] = useState<string>('');
    const [ responseText, setResponseText ] = useState<string>('');
    const [ selectedText, setSelectedText ] = useState<string>('');
    const [ resultFromDictionaryLookup, setResultFromDictionaryLookup ] = useState<string>('');
    const [ sentenceEditMode, setSentenceEditMode ] = useState<boolean>(false);
    const [ cardSubmissionBtnIsClick, setCardSubmissionBtnIsClick ] = useState<boolean>(false);
    const [ cardIsSubmitted, setCardIsSubmitted ] = useState<boolean>(false);
    const [ cardSubmissionError, setCardSubmissionError ] = useState<boolean>(false);

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
    
    async function uploadImageAsync(uri: string): Promise<string> {
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob: Blob = await new Promise((resolve, reject) => {
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
      
        const fileRef = ref(storage, `flashcards/${userId}/${uuid.v4()}`); // uuid for the photo object's name
        const result = await uploadBytesResumable(fileRef, blob);
      
        // We're done with the blob, close and release it
        // blob.close();
      
        return await getDownloadURL(fileRef);
      }

    const uploadToFirebaseCloudStorage = async (): Promise<void> => {
        if (image) {
            try {
                const uploadURL = await uploadImageAsync(image);
                setCloudStoragePath(uploadURL);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleSelectionChange = (e: any) => {
        if (responseText) {
            const start = e.nativeEvent.selection.start;
            const end = e.nativeEvent.selection.end;
            const selectedChunk = responseText.substring(start, end);
            setSelectedText(selectedChunk);
        }
    }

    useEffect(() => {
        async function fetchData () {
            await receiveDictionaryInfo();
        };
        if (selectedText !== '') fetchData(); 
        else setResultFromDictionaryLookup('');
    }, [selectedText]);

    const receiveDictionaryInfo = async (): Promise<void> => {
        try {
            let result = await lookupJishoApi(selectedText);
            setResultFromDictionaryLookup(result[0].toString());
        } catch (err) {
            console.log(err);
        }
    };

    const submitFlashCard = async (): Promise<void> => {
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
                const flashcard: TangoFlashcard = {
                    target_word: selectedText,
                    example_sentence: responseText,
                    reading: '',
                    card_language: 'jp',
                    Eng_meaning: [resultFromDictionaryLookup],
                    created_by: userId,
                    created_timestamp: dayjs(new Date()).toISOString(),
                    picture_url: 
                    // 'https://1.bp.blogspot.com/-YIfQT6q8ZM4/Vzyq5z1B8HI/AAAAAAAAAAc/UmWSSMLKtKgtH7CACElUp12zXkrPK5UoACLcB/s1600/image00.png',
                    cloudStoragePath,
                    public: true,
                    likers: [],
                    haters: [],
                    tags: [],
                    flagged_inappropriate: false,
                    flagging_users: []
                };
                try {
                    console.log(cloudStoragePath);
                    const response = await fetch(`https://tangoatsumare-api.herokuapp.com/api/flashcards`, { // put into .env
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(flashcard)
                    });
                    const responseJson = await response.json();
                    console.log(responseJson);
                    console.log('flashcard POSTed to the backend API');

                    // Note: adding boolean for setting by default ....
                    // POST request to user_to_cards table
                    const SRSFlashcard = initializeSRSFlashcard(flashcard);
                    console.log(SRSFlashcard);

                    // uid -> userId
                    // flashcard_id -> return value from the flashcards POST request (type: ObjectId)
                    // interval -> from SRSFlashcard
                    // efactor -> from SRSFlashcard
                    // repetition -> from SRSFlashcard
                    // due_date -> from SRSFlashcard

                    const requestBodyForUsersToCards = {
                        uid: userId,
                        flashcard_id: responseJson._id,
                        counter: SRSFlashcard.counter,
                        interval: SRSFlashcard.interval,
                        efactor: SRSFlashcard.efactor,
                        repetition: SRSFlashcard.repetition,
                        due_date: SRSFlashcard.due_date
                    }

                    await fetch(`https://tangoatsumare-api.herokuapp.com/api/userstocards`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBodyForUsersToCards)
                    });
                    console.log('SRS flashcard POSTed to the backend API');
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
                            onPress={submitFlashCard}
                        >
                            <Icon name="send" size={20} color="black"></Icon>
                        </Button>
                    );
                }
            }
        })
    })

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ImageBackground
                source={require("../assets/wallpaper1.png")}
                style={{
                    flex: 1,
                    backgroundColor: "white",
                    alignItems: 'center',
                    // justifyContent: 'center',
                }}
                resizeMode="contain"
            >
                { !cardSubmissionBtnIsClick ? 
                <>
                    <Image 
                        source={{ uri: image ? image : ""}} 
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <View 
                        style={styles.responseContainer}
                    >
                        <View style={styles.responseTitleContainer}>
                            <Text 
                                // style={styles.responseTitle}
                                variant="labelMedium"
                            >Select a word to learn</Text>
                            <Chip 
                                icon={sentenceEditMode ? "check-bold" : "cog"}
                                // textColor={sentenceEditMode ? "green" : "purple"}
                                mode="flat"
                                style={styles.editButton}
                                onPress={() => setSentenceEditMode((prev) => !prev)}
                            >
                                {sentenceEditMode ? "done" : "edit"}
                            </Chip>
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
                        <Text variant="labelMedium">You've selected</Text>
                        <Text 
                            style={styles.responseText}
                            variant="displayMedium"
                        >{selectedText}</Text>
                    </View>
                    <Text variant="labelMedium">Defintion</Text>
                    <Text 
                        style={styles.lookupText}
                        variant="displayMedium"
                    >{resultFromDictionaryLookup}</Text>
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
                        >{null}</Button>
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
                        >{null}</Button>
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
            </ImageBackground>
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
    editButton: {
        color: 'black',
        marginLeft: 20
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
  