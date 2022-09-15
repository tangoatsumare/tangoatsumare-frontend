import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from 'react-native'
import { Button, Card, Paragraph, Text, Title } from "react-native-paper";
import { rgb } from "color";
import axios from "axios";

import { 
  setFlashcardAsGood,
  setFlashcardAsAgain,
} from "../utils/supermemo";

export const Back = ({route}) => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const [flashcards, setFlashcards] = useState([]);
    const [flashcard, setFlashcard] = useState({})
    const [engDef, setEngDef] = useState('')

    let { flashcardsAll, index } = route.params;
    
    // useEffect(() => {
    //   console.log(flashcardsAll);
    // }, []);

    useEffect(() => {
      if (flashcardsAll) {
        setFlashcard(flashcardsAll[index]);
        setEngDef(flashcardsAll[index].english_definition[0])
      }
    }, [flashcardsAll]);

    const updateFlashCardsAllWithGood = () => {
      const result = [...flashcardsAll];
      for (let i = 0; i < result.length; i++) {
          if (result[i]._id === flashcard._id) {
              result[i] = setFlashcardAsGood(result[i]);
          }
      }
      return result;
    }

    const updateFlashCardsAllWithAgain = () => {
      const result = [...flashcardsAll];
      for (let i = 0; i < result.length; i++) {
          if (result[i]._id === flashcard._id) {
              result[i] = setFlashcardAsAgain(result[i]);
          }
      }
      return result;
    }
    
    // useEffect(() => {
    //     axios
    //       .get("https://tangoatsumare-api.herokuapp.com/api/flashcards")
    //       .then((response: any) => {
    //         const flashcards =
    //           response.data;
    //         setFlashcards(flashcards)
    //         const temp = flashcards[flashcards.length - 1];
    //         setFlashcard(temp); //typescript?
    //         setEngDef(temp.english_definition[0])

    //       });
    // }, []);

    const displayCard = (card: any) => {
        return (
            <Card key={card.target_word} style={styles.card}>
                    <Card.Content>
                    <Card.Cover  source={{uri: card.image ? card.image :  'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png'}}style={styles.photo} />
                    <Title style={styles.textVocab}>{card.target_word}</Title>
                    <Paragraph style={styles.text}>{card.reading}</Paragraph>
                    <Paragraph style={styles.text}> Meaning: {engDef}</Paragraph>
                    <Paragraph style={styles.text}>Sentence: {card.context}</Paragraph>
                    </Card.Content>
                    
               </Card>
            );
        };

    return (
        <View style={styles.container}>
         {displayCard(flashcard)}
            <View style={styles.buttonGroup}>
              <Button 
                mode="contained" 
                style={styles.againButton}
                buttonColor="green"
                onPress={()=>{
                    // fire the update flashcardsAll function
                    flashcardsAll = updateFlashCardsAllWithGood()

                    // if current index is the last item of the array
                    // navigate back to the SRS screen
                    if (index === flashcardsAll.length - 1) {
                      console.log('the end');
                      navigation.navigate("SRS", {
                        flashcardsAllModified: flashcardsAll
                      });
                    } else {
                      navigation.push("Front", {
                        flashcardsAll,
                        index: index + 1 // increment by 1 (populate the next flashcard in the array)
                      })
                    }
                }}
              >
                <Text>Good</Text>
              </Button>
              <Button 
                mode="contained" 
                style={styles.againButton}
                onPress={()=>{
                    flashcardsAll = updateFlashCardsAllWithAgain()

                    if (index === flashcardsAll.length - 1) {
                      console.log('the end');
                      navigation.navigate("SRS", {
                        flashcardsAllModified: flashcardsAll
                      });
                    } else {
                      navigation.push("Front", {
                        flashcardsAll,
                        index: index + 1
                      })
                    }
                }}
              >
                <Text>Again</Text>
              </Button>
            </View>
          
        </View>
    )
}

const styles = StyleSheet.create({
        buttonGroup: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around'
        },
        button: {
            alignItems: 'center',
                  },
        container: {
            flex: 1,
            justifyContent: 'center',
        },
        goodButton: {
            
        },
        againButton: {
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
      }
    },
);