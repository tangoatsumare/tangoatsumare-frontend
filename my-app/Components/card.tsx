import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase, RouteProp } from '@react-navigation/native'
import {Card, Paragraph, Title} from "react-native-paper";
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import axios from 'axios'
import { useRoute } from '@react-navigation/core'
import { ScreenRouteProp, StackParamsList } from "../library/routeProp";


export const SingleCard = () => {

    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const [flashcard, setFlashcard] = useState({})

    const route = useRoute<RouteProp<Record<string, StackParamsList>, string>>();


    useEffect(() => {

      axios
        .get(`https://tangoatsumare-api.herokuapp.com/api/flashcards/${route.params?.id}`)
        .then((response) => {
          setFlashcard(response.data[0])
        });
    }, []);
  
    const displayCard = (card: any) => {
        return (
            <Card key={card.target_word}>
                    <Card.Content>
                    <Card.Cover source={{ uri: 'https://www.japan-guide.com/g20/740/2040_04.jpg' }} />
                    <Paragraph style={styles.text}>Reading: {card.reading}</Paragraph>
                    <Title style={styles.text}>Vocab: {card.target_word}</Title>
                    <Paragraph style={styles.text}> English: {card.english_definition}</Paragraph>
                    <Paragraph style={styles.text}>Sentence: {card.context}</Paragraph>
                    </Card.Content>
                    
               </Card>
          

               
            );
        };

  return (
    <View style={styles.container}>
      {displayCard(flashcard)}
            
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    text: {
        textAlign: 'center',
      }
  })