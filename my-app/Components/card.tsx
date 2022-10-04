import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase, RouteProp } from '@react-navigation/native'
import {Card, Paragraph, Title, Text, ActivityIndicator, MD2Colors } from "react-native-paper";
import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, TouchableOpacity, View, ScrollView, Animated, Dimensions } from 'react-native'
import axios from 'axios'
import { useRoute } from '@react-navigation/core'
import { useTheme } from "react-native-paper";
import { ScreenRouteProp, StackParamsList } from "../library/routeProp";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
import Icon from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native-expo-image-cache';

const {width, height} = Dimensions.get('screen');

export const SingleCard = () => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [flashcard, setFlashcard] = useState({})
  const [engDef, setEngDef] = useState('')

  // const route = useRoute<RouteProp<Record<string, StackParamsList>, string>>();
  const route = useRoute<RouteProp<StackParamsList, 'Card'>>();
  const { item } = route?.params; // grab directly from the params

  useEffect(() => {
    if (item) {
      setFlashcard(item);
      setEngDef(item.Eng_meaning[0]);
    }
  }, [item]);

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
        flex: 1
      }}>
        {/* https://callstack.github.io/react-native-paper/activity-indicator.html */}
        {/* {loading && <ActivityIndicator animating={true} color="rgba(0,0,0,1)"/>} */}
        <Animated.ScrollView 
        // style={{opacity: fadeAnim}}
        contentContainerStyle={{
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
          <Image 
                preview={flashcard.picture_url}
                uri={flashcard.picture_url}
                style={styles.photo}
              />
          {/* <Card.Cover 
            onLoadStart={() => console.log('hi')}
            onLoadEnd={() => {
              // setTimeout(() => 
              setLoading(false)
              // , 500)
            }} // set a timeout for extending the activity indicator
            source={flashcard.picture_url && {uri: flashcard.picture_url}}
            style={loading ? {...styles.photo, opacity: 0.5} : styles.photo}
            resizeMode="cover"
          /> */}
          <View style={{paddingTop: 50}}>
            {/* <Paragraph style={styles.text}>{flashcard.reading}</Paragraph> */}
            <Text style={styles.textVocab} variant="displayLarge">{flashcard.target_word}</Text>
            <Text style={styles.text} variant="displayMedium">{engDef}</Text>
            <Text style={styles.text} variant="headlineMedium">{flashcard.example_sentence}</Text>
          </View>
          </Card.Content>
        </Card>   
        </Animated.ScrollView>
      </View>
    );
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      bounces={false}
    >
      {flashcard && <DisplayCard flashcard={flashcard} />}
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
    fontWeight: "bold"
  },
  card: {
    flex: 1,
    width: width - 50, // hard coded
    backgroundColor: "transparent",
  },
  photo: {
    height: width - 100,
    width: width - 100,
    backgroundColor: "transparent",
    borderRadius: 20,
  }
});