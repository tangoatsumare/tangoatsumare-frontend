import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from 'react-native'
import { Button, Card, Paragraph, Text, Title } from "react-native-paper";
import { rgb } from "color";
import axios from "axios";

export const Front = ({route}) => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const [flashcards, setFlashcards] = useState([]);
    const [flashcard, setFlashcard] = useState({})

    // https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
    // https://reactnavigation.org/docs/hello-react-navigation/#passing-additional-props
    // React Navigation docs recommend using React Context for passing data to screens

    // testing passing of props
    const { flashcardsAll, index } = route.params;

    useEffect(() => {
      if (flashcardsAll) {
        setFlashcard(flashcardsAll[index]);
      }
    }, [flashcardsAll]);

    const displayCard = (card: any) => {
        return (
            <Card key={card.target_word} style={styles.card}>
                    <Card.Content>
                    <Card.Cover  source={{uri: card.image ? card.image :  'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png'}}style={styles.photo} />
                    <Title style={styles.textVocab}>{card.target_word}</Title>
                    <Paragraph style={styles.text}>Sentence: {card.context}</Paragraph>
                    </Card.Content>
               </Card>
            );
        };

    return (
        <View style={styles.container}>
         {displayCard(flashcard)}
            
            <Button mode="contained" style={styles.againButton}
                    onPress={()=>{
                      // using push instead of navigate
                      // so a new "Back" screen is pushed to the stack
                      navigation.push("Back", { 
                          flashcardsAll,
                          index
                        })
                    }}>
                <Text>Answer</Text>
            </Button>
          
        </View>
    )
}

const styles = StyleSheet.create({
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