import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { StackParamsList } from "../library/routeProp";
import {Button, Card, Paragraph, Title} from "react-native-paper";

import React, { useEffect, useState } from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native'
import axios from "axios";


export const Collection = () => {

  const navigation = useNavigation<StackNavigationProp<StackParamsList>>();
const [flashcards, setFlashcards] = useState([])

  useEffect(() => {
    axios
      .get("https://tangoatsumare-api.herokuapp.com/api/flashcards")
      .then((response: any) => {
        const flashcards =
          response.data;
        setFlashcards(flashcards)
      });
  }, []);
  
      const handleShowFlashcard = (flashcardID: string) => {
        navigation.navigate("Card", {id: flashcardID})
        console.log(flashcardID)
  
        }

    const displayFlashcard = (flashcards: readonly any[] | null | undefined) => {
        return (
            <FlatList
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          data={flashcards}
          keyExtractor={(flashcard, index) => index.toString()}
          renderItem={({item}) => {
            return (
              <TouchableOpacity onPress={() => {
                handleShowFlashcard(item._id)
              }}
            >
              <Card key={item.target_word} style={styles.card}>
                    <Card.Content>
                    <Card.Cover source={{ uri: 'https://www.japan-guide.com/g20/740/2040_04.jpg' }} />
                    <Title style={styles.text}>Vocab: {item.target_word}</Title>
                    <Paragraph style={styles.text}>Sentence: {item.context}</Paragraph>
                    </Card.Content>
                    <Card.Actions>
             
                </Card.Actions>
               </Card>
              </TouchableOpacity>
            );
          }
        }
        />
        );
      }

  return (
    <View style={styles.container}>
      {displayFlashcard(flashcards)}
    </View>
  )
}

const styles = StyleSheet.create({
        button: {
            alignItems: 'center',
        },
        container: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        segment: {

        },
          separator: {
            height: 1,
            backgroundColor: "grey"
          },
          text: {
            textAlign: 'center',
          },
          card: {
            borderRadius: 10,
            margin: 10,
            marginTop: 2, 
          }
    }
);