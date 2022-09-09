import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React, { useEffect, useState } from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native'
import axios from "axios";

const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
const [flashcards, setFlashcards] = useState([])

useEffect(() => {
  axios
    .get("https://tangoatsumare-api.herokuapp.com//api/flashcards")
    .then((response: any) => {
      const flashcards = 
        response.data;
      setFlashcards(flashcards)
    });
}, []);

    const handleShowFlashcard = (flashcardName: any) => {
  //navigate
  console.log(flashcardName)
    
      }

export const Collection = () => {
   
  
    const displayFlashcard = (flashcards: readonly any[] | null | undefined) => {
        return (
            <FlatList
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          data={flashcards}
          keyExtractor={(flashcard, index) => index.toString()}
          renderItem={({item}) => {
            return (
              <View key={item.name}>

              <TouchableOpacity
                  onPress={() => {
                    handleShowFlashcard(item.name)
                  }}
                  style={styles.recipeButton}
                >
                <Text>Target Word: {item.target_word}</Text>
                <Text>Context: {item.context}</Text>
                </TouchableOpacity>
               </View>
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
          recipeButton: {
            backgroundColor: '#white',
            width: '80%',
            padding: 5,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 5,
          }
    }
);