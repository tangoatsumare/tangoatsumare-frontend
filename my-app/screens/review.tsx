import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native'
import { ActivityIndicator, Button, Card, Text, Title } from "react-native-paper";
import { 
    setFlashcardAsGood,
    setFlashcardAsAgain,
  } from "../utils/supermemo";
import { UsersToCardsSRSProps, HTTPRequest } from "../utils/httpRequest";
import { getAuth } from 'firebase/auth';
import { useTheme } from "react-native-paper";
import { Image } from 'react-native-expo-image-cache';
import { useTangoContext } from "../contexts/TangoContext";

const {width, height} = Dimensions.get('screen');

export const Review = ({route}) => {
  // NEW - using Tango Context
  const {
    updateSRSFlashcards,
  } = useTangoContext();

    const theme = useTheme();
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    
    let { flashcardsAll } = route.params;
    const [flashcards, setFlashcards] = useState(flashcardsAll);
    const [flashcard, setFlashcard] = useState({});

    const [ sideOfFlashcard, setSideOfFlashcard ] = useState<string>("Front"); // Front and Back
    const [ index, setIndex ] = useState<number>(0);
    
    const [ isEndOfReview, setIsEndOfReview ] = useState<boolean>(false);
    const isFirst = useRef(true);

    const [SRSFlashcardsUpdated, setSRSFlashcardsUpdated] = useState(false);

    // header 
    useLayoutEffect(() => {
        if (isEndOfReview) {
            navigation.setOptions({
                headerLeft: () => <></>
            })
        }
    }, [isEndOfReview]);

    useEffect(() => {
        setFlashcard(flashcardsAll[index].Flashcard[0]); // Updated per endpoint response format
        // setEngDef(flashcardsAll[index].Flashcard[0].Eng_meaning[0]); // Updated per endpoint response format
    }, [index]); // update states whenever index is changed

    const handleGoodButtonClick = () => {
        setFlashcards(updateFlashCardsAllWithGood());
    };

    const handleAgainButtonClick = () => {
        setFlashcards(updateFlashCardsAllWithAgain());
    };

    useEffect(() => {
        if (isFirst.current) isFirst.current = false; // avoid useEffect to trigger at initial flashcard setState
        else {
            if (index === flashcardsAll.length - 1) {
                console.log('the end');
                setIsEndOfReview(true);
            } else {
                setIndex((prev) => prev + 1); // increment the index
                setSideOfFlashcard("Front");
            }
        }
    }, [flashcards]);

    const updateFlashCardsAllWithGood = () => {
        const result = [...flashcards];
        for (let i = 0; i < result.length; i++) {
            if (result[i].Flashcard[0]._id === flashcard._id) {
                result[i] = setFlashcardAsGood(result[i]);
            }
        }
        return result;
    };
  
    const updateFlashCardsAllWithAgain = () => {
        const result = [...flashcards];
        for (let i = 0; i < result.length; i++) {
            if (result[i].Flashcard[0]._id === flashcard._id) {
                result[i] = setFlashcardAsAgain(result[i]);
            }
        }
        return result;
    };

    useEffect(() => {
        (async () => {
            if (isEndOfReview) {
                // array of objects
                const requestBody = [];
                for (const flashcard of flashcards) {
                    const item: UsersToCardsSRSProps = {
                        _id: flashcard._id,
                        counter: flashcard.counter,
                        efactor: flashcard.efactor,
                        interval: flashcard.interval,
                        repetition: flashcard.repetition,
                        due_date: flashcard.due_date,
                    }
                    requestBody.push(item);
                }            
    
                await updateSRSFlashcards(requestBody);
                setSRSFlashcardsUpdated(true);
            }
        })();
    }, [isEndOfReview]);

    useEffect(() => {
        console.log({SRSFlashcardsUpdated});
    }, [SRSFlashcardsUpdated]);

    const DisplayCard = ({flashcard}: any) => {
        const [loading, setLoading] = useState(true);
        const fadeAnim = useRef(new Animated.Value(0)).current;
    
        // https://www.youtube.com/watch?v=Jj9NaKkknis
        useEffect(() => {
          if (!loading) {
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              // https://stackoverflow.com/questions/61014661/animated-usenativedriver-was-not-specified-issue-of-reactnativebase-input
              useNativeDriver: true
            }).start();
          }
        }, [loading]);

        return (
            <Animated.View 
                style={{
                    flex: 1, 
                    alignItems: 'center',
                    // opacity: fadeAnim
                }}
            >
                <Card 
                    key={flashcard.target_word} 
                    style={styles.card}
                    mode="contained"
                >
                    <Card.Content>
                        <Image 
                            preview={flashcard.picture_url}
                            uri={flashcard.picture_url}
                            style={styles.photo} 
                        />
                        {/* <Card.Cover  
                            source={flashcard.picture_url && {uri: flashcard.picture_url}}
                            style={styles.photo} 
                            onLoadEnd={() => setLoading(false)}
                        /> */}
                        <View style={{paddingTop: 50}}>
                            <Text style={styles.textVocab} variant="displayLarge">{flashcard.target_word}</Text>
                            {sideOfFlashcard === 'Back' && <Text style={styles.text} variant="displayMedium">{flashcard.Eng_meaning[0]}</Text>}
                            <Text style={styles.text} variant="headlineMedium">{flashcard.example_sentence}</Text>
                        </View>
                    </Card.Content>        
                </Card>
            </Animated.View>
            );
        };

    return (
        <View 
            style={styles.container}
        >
            {!isEndOfReview && !SRSFlashcardsUpdated ? 
                    flashcard && 
                    <View style={{flex: 1}}>
                        <DisplayCard flashcard={flashcard} />
                        <View style={styles.buttonGroup}>
                                {sideOfFlashcard === 'Front' ?
                                <Button 
                                    mode="contained" 
                                    style={{
                                        ...styles.answerButton, 
                                        borderColor: theme.colors.primary
                                    }}
                                    onPress={()=> setSideOfFlashcard("Back")}
                                >
                                    <Text 
                                        variant="headlineSmall"
                                        style={{
                                            color: theme.colors.primary,
                                            fontWeight: 'bold'
                                        }}
                                    >Show Answer</Text>
                                </Button>
                                :
                                <>
                                    <Button 
                                        mode="contained" 
                                        style={{
                                            ...styles.goodButton,
                                            backgroundColor: theme.colors.primary,
                                            borderColor: theme.colors.primary,
                                        }}
                                        onPress={handleGoodButtonClick}
                                    >
                                        <Text
                                            variant="headlineSmall"
                                            style={{
                                                color: "white",
                                                fontWeight: 'bold'
                                            }}
                                        >Good</Text>
                                    </Button>
                                    <Button 
                                        mode="contained" 
                                        style={{
                                            ...styles.againButton, 
                                            backgroundColor: "transparent",
                                            borderColor: theme.colors.primary,
                                        }}
                                        onPress={handleAgainButtonClick}
                                    >
                                        <Text
                                            variant="headlineSmall"
                                            style={{
                                                color: theme.colors.primary,
                                                fontWeight: 'bold'
                                            }}
                                        >Again</Text>
                                    </Button>
                                </>
                                }
                        </View>
                    </View>
                : !SRSFlashcardsUpdated ?
                    <ActivityIndicator />
                :
                <View style={styles.endOfReview}>
                    <Text 
                        variant="headlineLarge"
                        style={{fontWeight: 'bold'}}
                    >Review Done</Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("TabHome", {
                                screen: "SRSNav",
                            })
                        }}
                    >
                        <Button
                            style={{
                                marginTop: 40,
                                padding: 10,
                                backgroundColor: theme.colors.primary,
                                borderRadius: 40,
                                width: width / 2
                            }}

                        >
                            <Text 
                                variant="headlineSmall"
                                style={{
                                    color: theme.colors.tertiary,
                                    fontWeight: 'bold'
                                }}
                            >
                                OK
                            </Text>
                        </Button>
                    </TouchableOpacity>
                </View> 
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    card: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width - 50, // hard coded
        backgroundColor: "transparent",
    },
    photo: {
        height: width - 50,
        width: width - 50,
        backgroundColor: "transparent",
        borderRadius: 20,
    },
    buttonGroup: {
        marginBottom: 60,
        flex: 1,
        flexDirection: 'row',
        // alignItems: 'stretch',
        alignItems: 'center',
        justifyContent: 'space-around',
        // margin: 20
    },
    button: {
        alignItems: 'center',
    },
    answerButton: {
        alignSelf: 'flex-end',
        width: width - 50,
        padding: 5,
        // marginBottom: 30,
        borderRadius: 30,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderWidth: 1.5,
        borderColor: 'black'
    },
    goodButton: {
        alignSelf: 'flex-end',
        width: width / 2,
        padding: 5,
        borderRadius: 0,
        borderStyle: 'solid',
        borderWidth: 1.5,
    },
    againButton: {
        alignSelf: 'flex-end',
        width: width / 2,
        padding: 5,
        borderRadius: 0,
        borderStyle: 'solid',
        borderWidth: 1.5,
    },
    text: {
        textAlign: 'center',
    },
    textVocab: {
        textAlign: 'center',
        fontWeight: "bold"
    },
    endOfReview: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});