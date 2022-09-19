import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { useIsFocused } from "@react-navigation/native";
import { StackParamsList } from "../library/routeProp";
import {Button, Card, Paragraph, Title} from "react-native-paper";

import React, { useEffect, useState } from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native'
import axios from "axios";
import { HTTPRequest } from "../utils/httpRequest";
import { getAuth } from 'firebase/auth';

export const Collection = () => {

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const navigation = useNavigation<StackNavigationProp<StackParamsList>>();
  const [flashcards, setFlashcards] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    // why using "isFocused"
    // https://stackoverflow.com/questions/60182942/useeffect-not-called-in-react-native-when-back-to-screen
    (async () => {
      if (isFocused) {
        try {
          const flashcards = await HTTPRequest.getFlashcardsByUser(userId);
          setFlashcards(flashcards.reverse());
        } catch (err) {
          console.log(err);
        }
      }
    })();
  }, [isFocused]);

  const handleShowFlashcard = (flashcardID: string) => {
    navigation.navigate("Card", {id: flashcardID})
    console.log(flashcardID)
  }

  const displayFlashcard = (flashcards: readonly any[] | null | undefined) => {
      return (
          <FlatList
            // inverted
            contentContainerStyle={{}}
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
                  <Card.Cover   source={{uri: item.picture_url ? item.picture_url : 'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png'}} />
                  <Title style={styles.textVocab}>{item.target_word}</Title>
                  <Paragraph style={styles.text}>Sentence: {item.example_sentence}</Paragraph>
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
            height: 0,
            backgroundColor: "grey"
          },
          text: {
            textAlign: 'center',
          },
          textVocab: {
            textAlign: 'center',
            fontWeight: "bold"
          },
          card: {
            borderRadius: 10,
            margin: 10,
            marginTop: 2, 
          },
    }
);