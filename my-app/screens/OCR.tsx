// import { useNavigation} from "@react-navigation/core";
import { 
    Image, StyleSheet, TextInput, View, ScrollView, TouchableOpacity, ImageBackground,
    Dimensions, Pressable, Animated
} from 'react-native';
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
import Icon from 'react-native-vector-icons/Octicons';
import {useTheme} from 'react-native-paper';

interface OCRProps {
    route: any;
    navigation: any;
}

interface Tag {
    [key: string]: any;
}

const {width, height} = Dimensions.get('screen');

export const OCR = ({ route, navigation }: OCRProps) => {
    const theme = useTheme();
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
    // 🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡
    const [ tags, setTags ] = useState<any>()
    const [ finalTagList, setFinalTagList ] = useState<any>([]);
    const [ tagInfo, setTagInfo ] = useState<any>();
    const [ allTagInfo, setAllTagInfo ] = useState<any>();
    const [ selectedTagsList, setSelectedTagsList ] = useState<any>([]);
    const [ numOfTags, setNumOfTags ] = useState<any>(0);

    // send to cloud vision once components are mounted
    useEffect(() => {
        (async () => {
            try {
                const result = await sendImageToCloudVisionApi(image_base64);
                // const result = "hi";
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

    // 🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡

    const HandleTagCreation = () => {
        // ⏭⏭⏭⏭⏭⏭ NEXT change color on press
        return (
            tags ?
                Object.keys(tags).map((tag) => {
                    return (
                        <Button mode="contained" key={tag} 
                        labelStyle={{color: 'white'}}
                        style={tags[tag] ? {...styles.tagButtons, backgroundColor: theme.colors.primary} : styles.tagButtons}
                        // selected={tags[tag]} //need to change this to something else or useeffect for this ?
                        onPress={() => {
                            
                            console.log(`${tag} pressed`);
                            console.log("tags[tag] boolean check before: ", tags[tag]);
                            if (tags[tag] === false) {
                                tags[tag] = true;
                                setSelectedTagsList([...selectedTagsList, tag])
                                setNumOfTags(numOfTags+1);
                                // console.log("tag: ", tag);
                            } else {
                                tags[tag] = false;
                                const tempTagsList = selectedTagsList
                                const tagIndex = tempTagsList.indexOf(tag);
                                if (tagIndex > -1) tempTagsList.splice(tagIndex, 1);
                                setSelectedTagsList(tempTagsList)
                                setNumOfTags(numOfTags-1);
                            }
                            console.log("tags[tag] boolean check after: ", tags[tag]);
                        }}
                        >
                            <Text 
                                variant='labelMedium' 
                                style={{
                                    color: theme.colors.tertiary,
                                    fontWeight: 'bold'
                                }}
                            >{tag}</Text>
                        </Button>
                    )
                })
            : null
        )
    }

    // useEffect(() => {
    //     if (selectedTagsList) {
    //         console.log("selected tags list check: ", selectedTagsList)
    //     }
    // }, [selectedTagsList])
    useEffect(() => {
        if (numOfTags > 0) {
            console.log("selected tags list check: ", selectedTagsList)
        }
    },[numOfTags])

    const handleFinalTagList = () => {
        const tagArr: any = finalTagList;
        Object.keys(tagInfo).map((tag) => {
            if (tags[tag] === true && !finalTagList.includes(tag)) {
                tagArr.push(tagInfo[tag])
            }
        })
        setFinalTagList(tagArr);
    }

    useEffect(() => {
        (async () => {
            let tagObj: Tag = {};
            try {
                const response = await
                    axios.get(`https://tangoatsumare-api.herokuapp.com/api/tags`)
                const tagData = response.data
                const tempTagObj: any = {}
                Object.keys(tagData).map((tag) => {
                    tagObj[tagData[tag].tag] = false;
                    tempTagObj[tagData[tag].tag] = tagData[tag]._id;
                })
                console.log("tempobj check: ", tempTagObj);
                console.log("tagobj check: ", tagObj)
                setTags(tagObj);
                setTagInfo(tempTagObj);
                setAllTagInfo(tagData);
            } catch(err) {
                console.log(err);
            }
        })();
    }, [])

    // useEffect(() => {
    //     if (allTagInfo) {
    //         console.log("alasdfasdfasdfl tag info check in test array: ", allTagInfo) 
    //     }
    // }, [allTagInfo])

    // 🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡

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
                // added
                handleFinalTagList();
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
                    tags: finalTagList, // formerly []
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
                    
                    // 🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡
                    if (finalTagList.length > 0) {
                        for (let i = 0; i < allTagInfo.length; i++) {
                            if (finalTagList.includes(allTagInfo[i]._id)) {
                                const flashcardIdArray = allTagInfo[i].flashcards
                                flashcardIdArray.push(requestBodyForUsersToCards.flashcard_id); // should push flashcard id
                                await axios.patch(`https://tangoatsumare-api.herokuapp.com/api/tags/${allTagInfo[i]._id}`, {
                                    flashcards: flashcardIdArray
                                })
                                .then(res => console.log("Tag patch successful"))
                                .catch(err => console.log("Error! ", err))
                            }
                        }
                    }
    
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
        if (cardSubmissionBtnIsClick) {
            navigation.setOptions({
                headerTitle: ""
            });
        }
    });

    const CardImage = ({image}) => {
        return (
            // {/* https://reactnative.dev/docs/pressable */}
            <Pressable
                onPress={() => console.log("completed a press")}
                onLongPress={()=> console.log("long pressed")}
                style={({ pressed }) => [
                    {
                    height: pressed
                        ? 150
                        : 100,
                        
                    },
                ]}
                >
                <Animated.View>
                <Image 
                    source={{ uri: image ? image : ""}} 
                    style={{
                        height: "100%",
                    }}
                    resizeMode="contain"
                />
                </Animated.View>
            </Pressable>
        );
    }

    return (
        <ScrollView 
            contentContainerStyle={{
                ...styles.container,
            }}
            bounces={false}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: "white",
                }}
            >
                { !cardSubmissionBtnIsClick ? 
                <>
                    <View 
                        style={{
                            flex: 1, 
                        }}
                    >
                        <CardImage image={image} />  
                        <View 
                            style={{...styles.responseContainer, flex: 0}}
                        > 
                            <TextInput
                                style={sentenceEditMode ? 
                                    { 
                                        borderColor: theme.colors.primary,
                                        width: width - 50,
                                        height: height / 4,
                                        fontSize: 30, // hard coded
                                        borderRadius: 20,
                                        borderStyle: 'solid',
                                        borderWidth: 0.5,
                                        padding: 10,
                                        margin: 20,
                                    } : 
                                    {...styles.responseText, 
                                        borderColor: theme.colors.secondary,
                                        borderStyle: 'solid',
                                        borderWidth: 0.5,
                                        padding: 10,
                                        borderRadius: 20,
                                        margin: 20,
                                        width: width - 50,
                                        height: height / 4,
                                        fontSize: 30, // hard coded
                                    }}
                                onSelectionChange={
                                    // sentenceEditMode ?
                                    (e) => handleSelectionChange(e) 
                                    // : 
                                    // () => {}
                                }
                                selectTextOnFocus={sentenceEditMode ? true : false}
                                onChangeText={(text) => setResponseText(text)}
                                editable={sentenceEditMode ? true : false}
                                multiline={true}
                            >
                                {responseText}
                            </TextInput>
                            <Chip 
                                mode="flat"
                                style={{
                                    backgroundColor: sentenceEditMode ? theme.colors.primary: theme.colors.tertiary,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: sentenceEditMode ? theme.colors.tertiary: theme.colors.primary,
                                    alignSelf: 'flex-end',
                                    marginRight: 20,
                                    justifyContent: 'center'
                                }}
                                onPress={() => setSentenceEditMode((prev) => !prev)}
                            >
                                <Text 
                                    style={{
                                        fontSize: 10,
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: sentenceEditMode ? theme.colors.tertiary: theme.colors.primary,
                                    }}
                                >
                                    {sentenceEditMode ? "Done" : "Edit Sentence"}
                                </Text>
                            </Chip>
                        </View>                        
                    </View>
                    <View style={{...styles.userTextSelection, flex: 0}}>
                        <TextInput 
                            style={{ 
                                // https://stackoverflow.com/questions/36444874/adding-border-only-to-the-one-side-of-the-text-component-in-react-native-ios
                                marginLeft: 20,
                                alignSelf: 'flex-start',
                                borderLeftWidth: 3,
                                borderLeftColor: theme.colors.primary,
                                borderStyle: 'solid',
                                paddingLeft: 10,
                            }}
                            value={"Selected word :"}
                            editable={false}
                        />
                        <View style={{height: 50}}>
                            { !selectedText ? 
                                <Text 
                                    variant='labelSmall'
                                    style={{
                                        color: 'rgba(0,0,0,0.3)',
                                        padding: 10
                                    }}
                                >
                                    User your finger to select a word from the above sentence</Text>
                                :
                                <Text
                                    variant="displaySmall"
                                    style={{
                                        padding: 10
                                    }}
                                >{selectedText}</Text>
                            }
                        </View>
                    </View>
                    <View style={{flex: 0, alignItems: 'center', marginTop: 25}}>
                        <TextInput 
                                style={{ 
                                    // https://stackoverflow.com/questions/36444874/adding-border-only-to-the-one-side-of-the-text-component-in-react-native-ios
                                    marginLeft: 20,
                                    alignSelf: 'flex-start',
                                    borderLeftWidth: 3,
                                    borderLeftColor: theme.colors.primary,
                                    borderStyle: 'solid',
                                    paddingLeft: 10
                                }}
                                value={"Dictionary result :"}
                                editable={false}
                            />
                            <View style={{height: 50}}>
                                { !selectedText ? 
                                    <Text 
                                        variant='labelSmall'
                                        style={{
                                            color: 'rgba(0,0,0,0.3)',
                                            padding: 10
                                        }}
                                    >User your finger to select a word from the above sentence</Text>
                                    :
                                    <Text 
                                        variant="displaySmall"
                                        style={{
                                            padding: 10
                                        }}   
                                    >{resultFromDictionaryLookup}</Text>
                                }
                            </View>
                    </View>

                    {/* 🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡 */}
                    <View style={{flex: 0, alignItems: 'center', marginTop: 25}}>
                        <TextInput 
                            style={{ 
                                // https://stackoverflow.com/questions/36444874/adding-border-only-to-the-one-side-of-the-text-component-in-react-native-ios
                                marginLeft: 20,
                                alignSelf: 'flex-start',
                                borderLeftWidth: 3,
                                borderLeftColor: theme.colors.primary,
                                borderStyle: 'solid',
                                paddingLeft: 10
                            }}
                            value={"Select Tags :"}
                            editable={false}
                        />
                        <View style={styles.tagBtnContainer}>
                            {/* {handleTagCreation()} */}
                            <HandleTagCreation />
                        </View>
                    </View>

                    {/* 🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡 */}

                </>
                    :
                !cardIsSubmitted && !cardSubmissionError ? 
                    <Text 
                        variant="bodyMedium" 
                        style={{
                            flex: 1, 
                            // alignItems: 'center', 
                            // justifyContent: 'center', 
                            fontWeight: 'bold',
                            marginTop: height / 2.5 // hard coded
                        }}
                    >Making a new card...</Text>
                         : 
                    cardIsSubmitted && !cardSubmissionError ?
                    <View style={styles.submissionContainer}>
                        <Icon name="check-circle" size={150}></Icon>
                        <Text variant="displaySmall" style={{fontWeight: 'bold'}}>Submitted!</Text>
                        <TouchableOpacity
                            onPress={()=>{
                                navigation.navigate("TabHome")
                            }}
                        >
                            <Button 
                                mode="contained-tonal" 
                                // icon="check-circle-outline" 
                                // labelStyle={{fontSize: 150}}
                                // textColor="green"
                                style={{
                                    marginTop: 30,
                                    width: width / 2,
                                    borderRadius: 30,
                                    borderWidth: 1,
                                    borderStyle: 'solid',
                                    borderColor: theme.colors.primary,
                                    backgroundColor: theme.colors.primary,
                                    marginBottom: 30 // hard code
                                }}
                            >
                                <Text 
                                    variant="bodyLarge"
                                    style={{
                                        color: theme.colors.tertiary, 
                                        fontWeight: 'bold'
                                    }}
                                    >OK</Text>
                            </Button>
                        </TouchableOpacity>


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
                                    navigation.navigate("TabHome")
                                }}
                        >OK</Button>
                    </View>
                }
            </View>
            { !cardSubmissionBtnIsClick &&
                <TouchableOpacity
                    onPress={submitFlashCard}
                    disabled={selectedText && responseText && resultFromDictionaryLookup? false : true}
                >
                    <Button 
                        mode="contained-tonal" 
                        style={{
                            marginTop: 30,
                            width: width / 2,
                            borderRadius: 30,
                            borderWidth: 1,
                            borderStyle: 'solid',
                            borderColor: selectedText && responseText && resultFromDictionaryLookup? theme.colors.primary: 'lightgrey',
                            backgroundColor: selectedText && responseText && resultFromDictionaryLookup? theme.colors.primary: 'lightgrey',
                            marginBottom: 30 // hard code
                        }}
                        >
                        <Text 
                            variant="bodyLarge"
                            style={{
                                color: theme.colors.tertiary, 
                                fontWeight: 'bold'
                            }}
                            >Submit</Text>
                    </Button>
                </TouchableOpacity>
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
    //   justifyContent: 'center',
    },
    button: {
        margin: 20,
    },
    responseContainer: {
        flex: 1,
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
    // editButton: {
    //     color: 'black',
    //     marginLeft: 20
    // },
    responseText: {
        fontSize: 20,
        margin: 20,
    },
    userTextSelection: {
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 50,
    },
    dictionaryLookup: {
        fontSize: 30,
    },
    // lookupText: {
    //     fontSize: 20,
    //     padding: 20
    // },
    submissionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagBtnContainer: {
        paddingTop: 5,
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        // alignContent: 'center',
    },
    tagButtons: {
        backgroundColor: 'lightgray',
        borderRadius: 20,
        margin: 2,
        // height: 30
    }
  });
  