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
    const [imageUrl, setImageUrl] = useState("")

    const [engDef, setEngDef] = useState('')

    // const route = useRoute<RouteProp<Record<string, StackParamsList>, string>>();
    const route = useRoute<RouteProp<StackParamsList, 'Card'>>();



    useEffect(() => {

      axios
        .get(`https://tangoatsumare-api.herokuapp.com/api/flashcards/${route.params?.id}`)
        .then((response) => {
          setFlashcard(response.data[0])
          setEngDef(response.data[0].english_definition[0])
          setImageUrl(response.data.image)
        });
    }, []);
  
    const displayCard = (card: any) => {
        return (
            <Card key={card.target_word} style={styles.card}>
                    <Card.Content>
                    <Card.Cover  source={{uri: imageUrl ? imageUrl :  'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png'}}style={styles.photo} />
                    <Paragraph style={styles.text}>{card.reading}</Paragraph>
                    <Title style={styles.textVocab}>{card.target_word}</Title>
                    <Paragraph style={styles.text}> Meaning: {engDef}</Paragraph>
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
      
  })