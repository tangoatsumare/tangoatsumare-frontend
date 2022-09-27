import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import React, {useState, useEffect} from "react";
import {Text, Button, Card, Paragraph, Title, Avatar} from "react-native-paper";
import {Image, View, StyleSheet, FlatList, TouchableOpacity, 
  Animated, Dimensions
} from 'react-native'


const { width, height } = Dimensions.get('screen');

export const Feed = ({item}) => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const handleShowFeedcard = (item: any) => {
        navigation.navigate("FeedCard", {item: item})
        console.log(item._id);
    };

    const [imgHeight, setImgHeight] = useState<number>();

    useEffect(() => {
      if (item.picture_url) {
        Image.getSize(item.picture_url, (width, height) => {
          setImgHeight(height);
        });
      }
    }, [item]);
  
    const [loading, setLoading] = useState(true);

    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (!loading) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }).start();
      }
    }, [loading]);

    return (
      <View style={styles.item}>
        <TouchableOpacity 
            onPress={() => { handleShowFeedcard(item) }}
        >
            <Animated.View 
              style={{
                ...styles.header, 
                opacity: fadeAnim
              }}
            >
                <Card style={styles.card} mode="contained">
                    <Card.Content
                        style={{
                            paddingHorizontal: 0,
                            paddingVertical: 0,
                          }}
                    >
                        <Card.Cover 
                            source={item.picture_url && {uri: item.picture_url}} 
                            onLoadEnd={() => {
                              setLoading(false)
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
            </Animated.View>
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