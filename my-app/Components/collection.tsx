import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import {Button, Text, Card, Paragraph, Title} from "react-native-paper";
import React, { useEffect, useState } from "react";
import {View, StyleSheet, FlatList, TouchableOpacity, Image, Animated} from 'react-native'

export const Collection = ({item}) => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const handleShowFlashcard = (item: any) => {
    navigation.navigate("Card", {item: item})
    console.log(item._id);
  }

  const [imgHeight, setImgHeight] = useState<number>();

  const [loading, setLoading] = useState(true);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // https://www.youtube.com/watch?v=Jj9NaKkknis
  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    }
  }, [loading]);

  useEffect(() => {
    if (item.picture_url) {
      Image.getSize(item.picture_url, (width, height) => {
        setImgHeight(height);
      });
    }
  }, [item]);

  return (
    <TouchableOpacity 
      onPress={() => { handleShowFlashcard(item) }}
      style={styles.collectionItem}
      activeOpacity={1}
    >
      <Animated.View
        style={{opacity: fadeAnim}}
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
              onLoadEnd={() => setLoading(false)}
              style={{
                height: imgHeight,
                backgroundColor: "transparent",
                borderRadius: 20
              }}
              resizeMode="cover"
              // resizeMode="contain"
            />
            <Title style={styles.textVocab}>{item.target_word}</Title>
          </Card.Content>
        </Card>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  collectionItem: {
    padding: 10,
    margin: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  text: {},
  textVocab: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 10,
  },
  card: {
    borderRadius: 10,
    backgroundColor: "transparent",
    marginBottom: 20
  },
});