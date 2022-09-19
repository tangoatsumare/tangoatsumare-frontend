import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from 'react-native'
import { Button, Card, Paragraph, Text, Title } from "react-native-paper";
import { 
    setFlashcardAsGood,
    setFlashcardAsAgain,
  } from "../utils/supermemo";
import axios from "axios";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export const Review = ({route}) => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const [flashcard, setFlashcard] = useState({});
    const [engDef, setEngDef] = useState<string>('');
    const [ sideOfFlashcard, setSideOfFlashcard ] = useState<string>("Front"); // Front and Back
    const [ index, setIndex ] = useState<number>(0);
    const [ isEndOfReview, setIsEndOfReview ] = useState<boolean>(false);

    let { flashcardsAll } = route.params; // not a state. is a variable that gets updated throughout the review
    const [flashcards, setFlashcards] = useState(flashcardsAll);

    useEffect(() => {
        setFlashcard(flashcardsAll[index].Flashcard[0]); // Updated per endpoint response format
        setEngDef(flashcardsAll[index].Flashcard[0].Eng_meaning[0]); // Updated per endpoint response format
    }, []);

    useEffect(() => {
      if (index && sideOfFlashcard === "Front") {
        setFlashcard(flashcardsAll[index].Flashcard[0]); // Updated per endpoint response format
        setEngDef(flashcardsAll[index].Flashcard[0].Eng_meaning[0]); // Updated per endpoint response format
      }
    }, [index, sideOfFlashcard]);

    useEffect(() => {
        if (isEndOfReview && flashcards) {
            console.log(flashcards);

            // array of objects
            const requestBody = [];
            for (const flashcard of flashcards) {
                const item = {
                    _id: flashcard._id,
                    counter: flashcard.counter,
                    efactor: flashcard.efactor,
                    interval: flashcard.interval,
                    repetition: flashcard.repetition,
                    due_date: flashcard.due_date,
                }
                requestBody.push(item);
            }
            
            console.log(requestBody);

            // TODO: PATCH request to update the user_to_flashcard scheduling table
            axios.patch(`https://tangoatsumare-api.herokuapp.com/api/userstocards/`, requestBody)
            // axios.patch(`https://tangoatsumare-api.herokuapp.com/api/userstocardsuid/${userId}`, requestBody)
            .then(res => console.log("success"))
            .catch(err => console.log(err));
        }
    }, [isEndOfReview, flashcards]);

    const updateFlashCardsAllWithGood = () => {
        const result = [...flashcardsAll];
        for (let i = 0; i < result.length; i++) {
            if (result[i].Flashcard[0]._id === flashcard._id) {
                result[i] = setFlashcardAsGood(result[i]);
            }
        }
        return result;
    };
  
    const updateFlashCardsAllWithAgain = () => {
        const result = [...flashcardsAll];
        for (let i = 0; i < result.length; i++) {
            if (result[i].Flashcard[0]._id === flashcard._id) {
                result[i] = setFlashcardAsAgain(result[i]);
            }
        }
        return result;
    };

    const DisplayCard = (card: any) => {
        return (
            <Card key={card.target_word} style={styles.card}>
                <Card.Content>
                    <Card.Cover  source={{uri: card.picture_url ? card.picture_url :  'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png'}}style={styles.photo} />
                    <Title style={styles.textVocab}>{card.target_word}</Title>
                    {sideOfFlashcard === 'Back' && <Paragraph style={styles.text}>{card.reading}</Paragraph>}
                    {sideOfFlashcard === 'Back' && <Paragraph style={styles.text}> Meaning: {engDef}</Paragraph>}
                    <Paragraph style={styles.text}>Sentence: {card.example_sentence}</Paragraph>
                </Card.Content>        
            </Card>
            );
        };

    return (
        <View style={styles.container}>
            {!isEndOfReview ? 
                sideOfFlashcard === 'Front' ?
                <>
                    {DisplayCard(flashcard)}
                    <View style={styles.buttonGroup}>
                        <Button mode="contained" buttonColor="skyblue" style={styles.answerButton}
                                onPress={()=> setSideOfFlashcard("Back")}>
                            <Text>Answer</Text>
                        </Button>
                    </View>
                </>
                    :
                <>
                    {DisplayCard(flashcard)}
                    <View style={styles.buttonGroup}>
                        <Button 
                            mode="contained" 
                            style={styles.goodButton}
                            buttonColor="green"
                            onPress={()=>{
                                // fire the update flashcardsAll function
                                flashcardsAll = updateFlashCardsAllWithGood();
                                console.log(flashcardsAll[flashcardsAll.indexOf(flashcard)]);
                                setFlashcards(flashcardsAll);
                                if (index === flashcardsAll.length - 1) {
                                    console.log('the end');
                                    setIsEndOfReview(true);
                                } else {
                                    setIndex((prev) => prev + 1); // increment the index
                                    setSideOfFlashcard("Front");
                                }
                            }}
                        >
                            <Text>Good</Text>
                        </Button>
                        <Button 
                            mode="contained" 
                            style={styles.againButton}
                            onPress={()=>{
                                flashcardsAll = updateFlashCardsAllWithAgain();
                                setFlashcards(flashcardsAll);
                                console.log(flashcards);
                                if (index === flashcardsAll.length - 1) {
                                    console.log('the end');
                                    setIsEndOfReview(true);
                                } else {
                                    setIndex((prev) => prev + 1); // increment the index
                                    setSideOfFlashcard("Front");
                                }
                            }}
                        >
                            <Text>Again</Text>
                        </Button>
                    </View>
                </>
                :
                <View style={styles.endOfReview}>
                    <Text>End of Review :)</Text>
                    <Button
                        onPress={() => {
                            navigation.navigate("TabHome", {
                                screen: "SRSNav",
                            })
                        }}
                    >Back to SRS</Button>
                </View> 
            }
        </View>
    )
}

const styles = StyleSheet.create({
        buttonGroup: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            margin: 20
        },
        button: {
            alignItems: 'center',
                  },
        container: {
            flex: 1,
            justifyContent: 'center',
        },
        answerButton: {
            width: 100,
        },
        goodButton: {
            width: 100
        },
        againButton: {
            width: 100
        },
        text: {
        textAlign: 'center',
      },
      textVocab: {
        textAlign: 'center',
        fontWeight: "bold"
      },
      card: {
        minWidth: '90%',
        borderRadius: 10,
        margin: 10,
        marginTop: 2, 
      },
      photo: {
        minWidth: '80%',
        minHeight: '50%',
        maxHeight: '95%',
        maxWidth: '95%',
      },
      endOfReview: {
        justifyContent: 'center',
        alignItems: 'center'
      }
    },
);