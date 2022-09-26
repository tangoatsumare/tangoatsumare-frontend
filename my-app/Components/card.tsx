import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase, RouteProp } from '@react-navigation/native'
import {Card, Paragraph, Title, Text, ActivityIndicator } from "react-native-paper";
import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, TouchableOpacity, View, Image, ScrollView, Animated } from 'react-native'
import axios from 'axios'
import { useRoute } from '@react-navigation/core'
import { useTheme } from "react-native-paper";
import { ScreenRouteProp, StackParamsList } from "../library/routeProp";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
import Icon from 'react-native-vector-icons/Ionicons';

export const SingleCard = () => {
  const theme = useTheme();
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
        setEngDef(response.data[0].Eng_meaning[0])
      });
  }, []);

  const DisplayCard = ({flashcard}: any) => {
    const [loading, setLoading] = useState(true);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // https://www.youtube.com/watch?v=Jj9NaKkknis
    useEffect(() => {
      if (!loading) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          // https://stackoverflow.com/questions/61014661/animated-usenativedriver-was-not-specified-issue-of-reactnativebase-input
          useNativeDriver: true
        }).start();
      }
    }, [loading]);

    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {/* https://callstack.github.io/react-native-paper/activity-indicator.html */}
        {loading && <ActivityIndicator animating={true} color="rgba(0,0,0,0.1)"/>}
        <Animated.View style={{
          opacity: fadeAnim,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Card 
          key={flashcard.target_word} 
          style={styles.card}
          mode="contained"
        >
          <Card.Content>
          <Card.Cover 
            onLoadStart={() => console.log('hi')}
            onLoadEnd={() => {
              // setTimeout(() => 
              setLoading(false)
              // , 500)
            }} // set a timeout for extending the activity indicator
            source={flashcard.picture_url && {uri: flashcard.picture_url}}
            style={loading ? {...styles.photo, opacity: 0.5} : styles.photo}
            resizeMode="contain"
          />
          {/* <Paragraph style={styles.text}>{flashcard.reading}</Paragraph> */}
          <Text style={styles.textVocab} variant="displayLarge">{flashcard.target_word}</Text>
          <Text style={styles.text} variant="displayMedium">{engDef}</Text>
          <Text style={styles.text} variant="bodyLarge">{flashcard.example_sentence}</Text>
          </Card.Content>
        </Card>   
        </Animated.View>
      </View>
    );
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      bounces={false}
    >
      <DisplayCard flashcard={flashcard} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white'
    },
    text: {
        textAlign: 'center',
      },
      textVocab: {
        textAlign: 'center',
        // fontWeight: "bold"
      },
        card: {
            flex: 1,
            minWidth: '90%',
            borderRadius: 10,
            margin: 10,
            marginTop: 2, 
            backgroundColor: "transparent"
          },
          photo: {
            minWidth: '80%',
            // minHeight: '80%',
            // maxHeight: '80%',
            height: '60%',
            maxWidth: '95%',
            backgroundColor: "transparent",
            transition: [

            ]
          }
      
  })