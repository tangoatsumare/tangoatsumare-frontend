import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import {Button, Text, Card, Paragraph, Title} from "react-native-paper";
import React, { useEffect, useState } from "react";
import {View, StyleSheet, FlatList, TouchableOpacity, Image} from 'react-native'

export const Collection = ({item}) => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const handleShowFlashcard = (flashcardID: string) => {
    navigation.navigate("Card", {id: flashcardID})
    console.log(flashcardID);
  }

  const [imgHeight, setImgHeight] = useState<number>();

  useEffect(() => {
    if (item.picture_url) {
      Image.getSize(item.picture_url, (width, height) => {
        setImgHeight(height);
      });
    }
  }, [item]);

  return (
    <TouchableOpacity 
      onPress={() => { handleShowFlashcard(item._id) }}
      style={styles.collectionItem}
    >
      <Card 
        key={item.target_word} 
        style={styles.card}
        mode="contained"
      >
        <Card.Content
          style={{
            paddingHorizontal: 0,
            paddingVertical: 0,
            height: imgHeight
          }}
          // https://stackoverflow.com/questions/61511559/how-can-i-resize-an-image-in-a-react-paper-card-cover-to-fit-the-height
        >
          <Card.Cover 
            source={{
              uri: item.picture_url ? 
                    item.picture_url : 
                    'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png'
            }} 
            style={{
              height: imgHeight,
              // padding: 10
            }}
            // resizeMode="cover"
            resizeMode="contain"
          />
          
        </Card.Content>
      </Card>
      <Title style={styles.textVocab}>{item.target_word}</Title>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  collectionItem: {
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  text: {},
  textVocab: {
    fontSize: 15,
    fontWeight: "bold"
  },
  card: {
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.05)"
  },
});