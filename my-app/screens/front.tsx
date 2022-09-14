import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from 'react-native'
import { Button, Card, Paragraph, Text, Title } from "react-native-paper";
import { rgb } from "color";
import axios from "axios";


export const Front = () => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const [flashcards, setFlashcards] = useState([]);
    const [flashcard, setFlashcard] = useState({})

    useEffect(() => {
        axios
          .get("https://tangoatsumare-api.herokuapp.com/api/flashcards")
          .then((response: any) => {
            const flashcards =
              response.data;
            setFlashcards(flashcards)
            const temp = flashcards[flashcards.length - 1];
            setFlashcard(temp); //typescript?
          });
    }, []);

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
                        navigation.navigate("Back")
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