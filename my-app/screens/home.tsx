import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Keyboard } from 'react-native';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { SegmentedButtons, Text, Button, Card, Paragraph, Title, Avatar } from "react-native-paper";
// import { Collection } from "../Components/collection";
// import { Feed } from "../Components/feed";
import { HTTPRequest } from "../utils/httpRequest";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { getAuth } from 'firebase/auth';
import { SearchBar, SearchBody } from '../screens/Search';

//test
  import { getProfileInfoById } from "../utils/profileInfo";
//test

export const Home = () => {
  dayjs.extend(relativeTime);
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [value, setValue] = React.useState('feed');
  const [userUid, setUserUid] = React.useState<string>('');
  const [userProfileInfo, setUserProfileInfo] = React.useState<any>();

  const [text, setText] = useState('');
  const [textInputOnFocus, setTextInputOnFocus] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [flashcardsOnView, setFlashcardsOnView] = useState([]);
  const isFocused = useIsFocused();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  // setting the header section
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <SearchBar 
          text={text} 
          setText={setText} 
          textInputOnFocus={textInputOnFocus}
          setTextInputOnFocus={setTextInputOnFocus}
        />
      ),
      headerRight: () => {
        if (textInputOnFocus) {
          return (
            <Button 
                mode="contained-tonal" 
                onPress={() => {
                    Keyboard.dismiss();
                    setTextInputOnFocus(false);
                }}
                style={{marginLeft: 10}}
            >Cancel</Button>
          );
        }
      }
    })
  });

  useEffect(() => {
    if (isFocused) {
      setValue('feed');
    }
  }, [isFocused]);

  useEffect(() => {
      (async () => {
        if (isFocused) {
          try {
              const flashcardsAll = await HTTPRequest.getFlashcards();
              const usersAll = await HTTPRequest.getUsers();
              
              for (const card of flashcardsAll) {
                  const result = usersAll.find((user: any) => user.uuid === card.created_by);
                  if (result) {
                      card.created_by_username = result.user_name; // replace uid with username
                      card.avatar_url = result.avatar_url; // add field
                  }
                  card.created_timestamp = dayjs(card.created_timestamp).fromNow(); // https://day.js.org/docs/en/plugin/relative-time
              }
  
              const result = flashcardsAll.reverse();
              setFlashcards(result);
              setFlashcardsOnView(result);
          } catch (err) {
              console.log(err);
          }
        }
      })();
  }, [isFocused]);

  useEffect(() => {
    if (flashcards) {
      if (value === 'feed') {
        setFlashcardsOnView(flashcards);
      } else if (value === 'collection') {
        const result = flashcards.filter(flashcard => flashcard["created_by"] === userId);
        if (result) {
          setFlashcardsOnView(result);
        }
      }
    }
  }, [value]);

  useEffect(() => {
    if (flashcardsOnView) console.log(flashcardsOnView);
  }, [flashcardsOnView]);

  // should be in utils maybe?
  const handleUID = () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid
    setUserUid(userId || '') // typescript??
  }

  useEffect(() => {
    handleUID();
    handleUserProfileInfo();
  }, []);

  const handleUserProfileInfo = async () => {
    const info = await getProfileInfoById(12345);
    setUserProfileInfo(info);
  }

  const handleShowFlashcard = (flashcardID: string) => {
    navigation.navigate("Card", {id: flashcardID})
    console.log(flashcardID);
  }

  const Feed = ({item}) => {
    return (
      <View style={styles.item}>
        <TouchableOpacity 
            onPress={() => { handleShowFlashcard(item._id) }}
        >
            <View style={styles.header}>
                <View style={styles.user}>
                    <Avatar.Image 
                    size={35} 
                    source={{ 
                        uri: item.avatar_url? item.avatar_url: 'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png' 
                    }} 
                    style={styles.userLeft}/>
                    <View style={styles.userRight}>
                        <Text variant="bodyLarge">{item.created_by_username}</Text>
                        <Text variant="bodySmall">{item.created_timestamp}</Text>
                    </View>
                </View>
                <Card style={styles.card}>
                    <Card.Content>
                        <Card.Cover 
                            source={{
                                uri: item.picture_url ? item.picture_url : 'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png'
                            }} 
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
            <Button icon="emoticon-angry-outline">
                report
            </Button>
        </View>
      </View>
    );
  };

  const Collection = ({item}) => {
    return (
      <TouchableOpacity 
        onPress={() => { handleShowFlashcard(item._id) }}
        style={styles.item}
      >
        <Card key={item.target_word} style={styles.card}>
              <Card.Content>
              <Card.Cover   source={{uri: item.picture_url ? item.picture_url : 'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png'}} />
              <Title style={styles.textVocab}>{item.target_word}</Title>
              <Paragraph style={styles.text}>Sentence: {item.example_sentence}</Paragraph>
              </Card.Content>
              <Card.Actions>
        
          </Card.Actions>
          </Card>
      </TouchableOpacity>
    );
  };

  return (
    <>
      { !textInputOnFocus && flashcardsOnView ? 
      <FlatList style={styles.container}
        ListHeaderComponent={
          <>
            <SegmentedButtons
              value={value}
              onValueChange={setValue}
              buttons={[
                {
                  value: 'collection',
                  label: 'Collection',
                },
                {
                  value: 'feed',
                  label: 'Feed',
                },
              ]}
              style={styles.segment}
            />
          </>
        }
        data={flashcardsOnView}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => (
          value === 'feed' ?            
            <Feed item={item} />
          : value === 'collection' ?
            <Collection item={item} />
          : null)
        }
      />
        :
        <SearchBody 
          text={text} 
          setText={setText} 
          textInputOnFocus={textInputOnFocus}
          setTextInputOnFocus={setTextInputOnFocus}
        /> 
      }
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
  container: {
    marginTop: 20,
    // flex: 1
  },
  segment: {
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    padding: 10,
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
  buttonGroup: {
    flexDirection: 'row'
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
  separator: {
      height: 0.2,
      backgroundColor: "grey"
  }
})