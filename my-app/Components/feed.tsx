import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import { useIsFocused } from "@react-navigation/native";
import React, {useState, useEffect} from "react";
import {Text, Button, Card, Paragraph, Title, Avatar} from "react-native-paper";
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native'
import { HTTPRequest } from "../utils/httpRequest";

export const Feed = () => {
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
                        console.log(result.user_name);
                        card.created_by = result.user_name; // replace uid with username
                        card.avatar = result.avatar_url; // add field
                    }
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
                // inverted
                contentContainerStyle={{}}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                data={flashcards}
                keyExtractor={(flashcard, index) => index.toString()}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity onPress={() => {
                      handleShowFlashcard(item._id)
                    }}
              >
                <View key={item.target_word} style={styles.item}>
                    <View style={styles.user}>
                        <Avatar.Image size={50} source={item.avatar} style={styles.userLeft}/>
                        <View style={styles.userRight}>
                            <Text variant="bodyLarge">{item.created_by}</Text>
                            <Text variant="bodySmall">{item.created_timestamp}</Text>
                        </View>
                    </View>
                    <Card style={styles.card}>
                        <Card.Content>
                        <Card.Cover source={{uri: item.picture_url ? item.picture_url : 'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png'}} />
                        <Title style={styles.textVocab}>{item.target_word}</Title>
                        <Paragraph style={styles.text}>Sentence: {item.example_sentence}</Paragraph>
                        </Card.Content>
                        <Card.Actions>
                    
                        </Card.Actions>
                    </Card>
                </View>
                </TouchableOpacity>
              );
            }
          }
          />
          );
        }
    
      return (
        <View style={styles.container}>
          {displayFlashcard(flashcards)}
        </View>
      )
    }
    
    const styles = StyleSheet.create({
            item: {
                marginBottom: 20
            },
            user: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginBottom: 10
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
                alignItems: 'center',
                justifyContent: 'center',
            },
            segment: {
    
            },
              separator: {
                height: 0,
                backgroundColor: "grey"
              },
              text: {
                textAlign: 'center',
              },
              textVocab: {
                textAlign: 'center',
                fontWeight: "bold"
              },
              card: {
                borderRadius: 10,
                margin: 10,
                marginTop: 2, 
              },
        }
    );