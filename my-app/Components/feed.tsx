import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import React, {useState, useEffect} from "react";
import {Text, Button, Card, Paragraph, Title, Avatar} from "react-native-paper";
import {Image, View, StyleSheet, FlatList, TouchableOpacity, Dimensions} from 'react-native'


const { width, height } = Dimensions.get('screen');

export const Feed = ({item}) => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const handleShowFeedcard = (flashcardID: string) => {
        navigation.navigate("FeedCard", {id: flashcardID})
        console.log(flashcardID);
    };

    const [imgHeight, setImgHeight] = useState<number>();

    useEffect(() => {
      if (item.picture_url) {
        Image.getSize(item.picture_url, (width, height) => {
          setImgHeight(height);
        });
      }
    }, [item]);
  
    
    return (
      <View style={styles.item}>
        <TouchableOpacity 
            onPress={() => { handleShowFeedcard(item._id) }}
        >
            <View style={styles.header}>
                <Card style={styles.card} mode="contained">
                    <Card.Content
                        // style={{paddingHorizontal: 0}}
                        style={{
                            paddingHorizontal: 0,
                            paddingVertical: 0,
                            // backgroundColor: 'transparent'
                            // height: imgHeight
                          }}
                    >
                        <Card.Cover 
                            source={{
                                uri: item.picture_url ? 
                                    item.picture_url : 
                                    'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png'
                            }} 
                            style={{
                                borderRadius: 20,
                                backgroundColor: 'transparent'
                              }}
                            resizeMode="cover"
                        />
                    </Card.Content>
                    <Card.Actions>
                    </Card.Actions>
                </Card>
                <Title style={styles.textVocab}>{item.target_word}</Title>
            </View>
        </TouchableOpacity>
      </View>
    );
  };


const styles = StyleSheet.create({
    item: {
      width: width / 2,
    },
    header: {},
    textVocab: {
        fontWeight: "bold",
        fontSize: 15,
        marginLeft: 5,
        marginBottom: 10,
    },
    card: {
        borderRadius: 10,
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: "white"
    },
    image: {
        backgroundColor: 'transparent'
    },
});