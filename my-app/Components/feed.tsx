import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import React, {useState, useEffect} from "react";
import {Text, Button, Card, Paragraph, Title, Avatar} from "react-native-paper";
import { View, StyleSheet, FlatList, TouchableOpacity, 
  Animated, Dimensions
} from 'react-native';
import { Image } from 'react-native-expo-image-cache';
// TESTING FONTS
import {useFonts} from 'expo-font';
// TESTING FONTS

const { width, height } = Dimensions.get('screen');

export const Feed = ({item}) => {
  // TESTING FONTS

  // https://docs.expo.dev/versions/latest/sdk/font/
  const [fontsLoaded] = useFonts({
    'NotoSansJP': require('../assets/fonts/Noto_Sans_JP/NotoSansJP-Regular.otf'),

  });
  // TESTING FONTS

    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const handleShowFeedcard = (item: any) => {
        navigation.navigate("FeedCard", {item: item})
        console.log(item._id);
    };

    // const [imgHeight, setImgHeight] = useState<number>();

    // useEffect(() => {
    //   if (item.picture_url) {
    //     Image.getSize(item.picture_url, (width, height) => {
    //       setImgHeight(height);
    //     });
    //   }
    // }, [item]);
  
    const [loading, setLoading] = useState(true);
    // const [loading, setLoading] = useState(false);

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
            activeOpacity={1}
        >
            <Animated.View 
              style={{
                ...styles.header, 
                // opacity: fadeAnim
              }}
            >
                <Card style={styles.card} mode="contained">
                    <Card.Content
                        style={{
                            paddingHorizontal: 0,
                            paddingVertical: 0,
                          }}
                    >
                        <Image 
                          preview={item.picture_uri}
                          uri={item.picture_url}
                          style={{
                            height: (width - 20) / 2,
                            width: (width - 20) / 2,
                            borderRadius: 20,
                            backgroundColor: 'transparent'
                          }}
                        />
                      
                        {/* <Card.Cover
                            source={item.picture_url && {uri: item.picture_url}} 
                            onLoadEnd={() => {
                              setLoading(false)
                            }}
                            defaultSource={require('../assets/splash.png')}
                            style={{
                                borderRadius: 20,
                                backgroundColor: 'transparent'
                              }}
                            resizeMode="cover"
                        /> */}
                      {/* } */}
                      {/* {loading && 
                        <Card.Cover 
                          source={require('../assets/wakeupcat.jpeg')} 
                          style={{
                              borderRadius: 20,
                              backgroundColor: 'transparent'
                            }}
                          resizeMode="cover"
                        />
                      } */}
                    {fontsLoaded && <Title style={styles.textVocab}>{item.target_word}</Title>}

                    </Card.Content>
                </Card>
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
        // marginBottom: 10,
        fontFamily: "NotoSansJP"
    },
    card: {
        borderRadius: 10,
        margin: 10,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: "transparent",
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        backgroundColor: 'transparent'
    },
});