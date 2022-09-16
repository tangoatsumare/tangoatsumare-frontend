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

export const Review = ({route}) => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const [flashcard, setFlashcard] = useState({});
    const [engDef, setEngDef] = useState<string>('');
    const [ sideOfFlashcard, setSideOfFlashcard ] = useState<string>("Front"); // Front and Back
    const [ index, setIndex ] = useState<number>(0);
    const [ isEndOfReview, setIsEndOfReview ] = useState<boolean>(false);

    let { flashcardsAll } = route.params; // not a state. is a variable that gets updated throughout the review

    useEffect(() => {
        setFlashcard(flashcardsAll[index]);
        setEngDef(flashcardsAll[index].english_definition[0]);
    }, []);

    useEffect(() => {
      if (index && sideOfFlashcard === "Front") {
        setFlashcard(flashcardsAll[index]);
        setEngDef(flashcardsAll[index].english_definition[0]);
      }
    }, [index, sideOfFlashcard]);

    useEffect(() => {
        if (isEndOfReview) {
            // TODO: PATCH request to update the user_to_flashcard scheduling table
            // axios.patch()
        }
    }, [isEndOfReview]);

    const updateFlashCardsAllWithGood = () => {
        const result = [...flashcardsAll];
        for (let i = 0; i < result.length; i++) {
            if (result[i]._id === flashcard._id) {
                result[i] = setFlashcardAsGood(result[i]);
            }
        }
        return result;
    };
  
    const updateFlashCardsAllWithAgain = () => {
        const result = [...flashcardsAll];
        for (let i = 0; i < result.length; i++) {
            if (result[i]._id === flashcard._id) {
                result[i] = setFlashcardAsAgain(result[i]);
            }
        }
        return result;
    };

    const DisplayCard = (card: any) => {
        return (
            <Card key={card.target_word} style={styles.card}>
                <Card.Content>
                    <Card.Cover  source={{uri: card.image ? card.image :  'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png'}}style={styles.photo} />
                    <Title style={styles.textVocab}>{card.target_word}</Title>
                    {sideOfFlashcard === 'Back' && <Paragraph style={styles.text}>{card.reading}</Paragraph>}
                    {sideOfFlashcard === 'Back' && <Paragraph style={styles.text}> Meaning: {engDef}</Paragraph>}
                    <Paragraph style={styles.text}>Sentence: {card.context}</Paragraph>
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