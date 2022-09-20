import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import { useIsFocused } from "@react-navigation/native";
import React, {useState, useEffect} from "react";
import {Text, Button, Card, Paragraph, Title, Avatar} from "react-native-paper";
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native'
import { HTTPRequest } from "../utils/httpRequest";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export const Feed = () => {
    dayjs.extend(relativeTime);
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const [flashcards, setFlashcards] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        // why using "isFocused"
        // https://stackoverflow.com/questions/60182942/useeffect-not-called-in-react-native-when-back-to-screen
        (async () => {
          if (isFocused) {
            try {
                const flashcardsAll = await HTTPRequest.getFlashcards();
                const usersAll = await HTTPRequest.getUsers();
                
                for (const card of flashcardsAll) {
                    const result = usersAll.find((user: any) => user.uuid === card.created_by);
                    if (result) {
                        // console.log(result.user_name);
                        card.created_by = result.user_name; // replace uid with username
                        card.avatar = result.avatar_url; // add field
                    }
                    // https://day.js.org/docs/en/plugin/relative-time
                    card.created_timestamp = dayjs(card.created_timestamp).fromNow();
                }
    
                setFlashcards(flashcardsAll.reverse());
            } catch (err) {
                console.log(err);
            }
          }
        })();
      }, [isFocused]);

      const handleShowFlashcard = (flashcardID: string) => {
        navigation.navigate("Card", {id: flashcardID})
        console.log(flashcardID)
      }
    
      const displayFlashcard = (flashcards: readonly any[] | null | undefined) => {
          return (
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{}}
                // ItemSeparatorComponent={() => <View style={styles.separator} />}
                data={flashcards}
                keyExtractor={(item) => item._id}
                renderItem={({item}) => {
                  return (
                      <View style={styles.item}>
                        <TouchableOpacity 
                            onPress={() => { handleShowFlashcard(item._id) }}
                        >
                            <View style={styles.header}>
                                <View style={styles.user}>
                                    <Avatar.Image size={35} source={item.avatar} style={styles.userLeft}/>
                                    <View style={styles.userRight}>
                                        <Text variant="bodyLarge">{item.created_by}</Text>
                                        <Text variant="bodySmall">{item.created_timestamp}</Text>
                                    </View>
                                </View>
                                <Card style={styles.card}>
                                    <Card.Content>
                                        <Card.Cover 
                                            source={{uri: item.picture_url ? item.picture_url : 'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png'}} 
                                            style={styles.image}
                                            resizeMode="contain"
                                        />
                                        <Title style={styles.textVocab}>{item.target_word}</Title>
                                        <Paragraph style={styles.text}>Sentence: {item.example_sentence}</Paragraph>
                                    </Card.Content>
                                    <Card.Actions>
                                    </Card.Actions>
                                </Card>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.buttonGroup}>
                            <Button icon="butterfly">
                                views
                            </Button>
                            <Button icon="star">
                                rating
                            </Button>
                            <Button icon="bookshelf">
                                Add to deck
                            </Button>
                            {/* <Text>deck no.</Text> */}
                            <Button icon="emoticon-angry-outline">
                                report
                            </Button>
                        </View>
                      </View>
                    );
                }
            }
          />
          );
        }
    
      return (
        <View style={styles.container}>
          {flashcards? displayFlashcard(flashcards) : null}
        </View>
      )
    }
    
    const styles = StyleSheet.create({
            item: {
              padding: 10,
            //   borderTopWidth: 0.2,
            //   borderTopColor: 'grey',
              borderBottomWidth: 0.2,
              borderBottomColor: 'grey'
            },
            header: {

            },
            user: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginBottom: 10,
                marginTop: 10
            },
            userLeft: {
                marginRight: 10
            },
            userRight: {
                alignItems: 'flex-start'
            },
            username: {

            },
            button: {
                alignItems: 'center',
            },
            container: {
                // alignItems: 'center',
                // justifyContent: 'center',
            },
            segment: {
    
            },
            separator: {
                height: 0.2,
                backgroundColor: "grey"
            },
            text: {

            },
            textVocab: {
                textAlign: 'center',
                fontWeight: "bold"
            },
            card: {
                borderRadius: 10,
                marginLeft: 20,
                marginRight: 20
                // marginTop: 2, 
                // padding: 10
            },
            image: {
                backgroundColor: 'transparent'
            },
            buttonGroup: {
                flexDirection: 'row'
            }
        }
    );