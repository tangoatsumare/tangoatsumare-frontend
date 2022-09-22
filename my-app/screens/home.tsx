import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { Keyboard, Dimensions } from 'react-native';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { SegmentedButtons, Text, Button, Card, Paragraph, Title, Avatar, Divider } from "react-native-paper";
// import { Collection } from "../Components/collection";
// import { Feed } from "../Components/feed";
import { HTTPRequest } from "../utils/httpRequest";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { getAuth } from 'firebase/auth';
import { SearchBar, SearchBody } from '../screens/Search';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

//test
  import { getProfileInfoById } from "../utils/profileInfo";
//test

const { width } = Dimensions.get('window');

export const Home = () => {
  dayjs.extend(relativeTime);
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [value, setValue] = useState('feed');
  const [userUid, setUserUid] = useState<string>('');
  const [userProfileInfo, setUserProfileInfo] = useState<any>();

  const [text, setText] = useState<string>('');
  const [textInputOnFocus, setTextInputOnFocus] = useState<boolean>(false);
  const [flashcardsMaster, setFlashcardsMaster] = useState<object[]>([]);
  const [flashcardsCurated, setFlashcardsCurated] = useState<object[]>([]);
  const [flashcardsCollection, setFlashcardsCollection] = useState<object[]>([]);
  const [flashcardsFeed, setFlashcardsFeed] = useState<object[]>([]);
  const [resetIsClick, setResetIsClick] = useState<boolean>(false);

  const [submitIsClick, setSubmitIsClick] = useState<boolean>(false);

  const isFocused = useIsFocused();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const scrollRef = useRef();

  // setting the header section
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: 'black'
      },
      headerTitle: () => (
        <SearchBar 
          text={text} 
          setText={setText} 
          textInputOnFocus={textInputOnFocus}
          setTextInputOnFocus={setTextInputOnFocus}
          flashcardsCurated={flashcardsCurated}
          setFlashcardsCurated={setFlashcardsCurated}
          flashcardsFeed={flashcardsFeed}
          submitIsClick={submitIsClick}
          setSubmitIsClick={setSubmitIsClick}
          resetIsClick={resetIsClick}
          flashcardsMaster={flashcardsMaster}
        />
      ),
      headerRight: () => {
        if (textInputOnFocus) {
          return (
            <Button 
                mode="text" 
                onPress={cancelSearch}
                style={{marginLeft: 5}}
            >
              <Text variant="labelLarge" style={{color: 'white'}}>cancel</Text>
              </Button>
          );
        } else if (!textInputOnFocus && submitIsClick) {
          return (
            <Button 
                mode="text" 
                onPress={resetHomeScreen}
                style={{marginLeft: 5}}
            >
              <Text variant="labelLarge" style={{color: 'white'}}>reset</Text>
              </Button>
          );
        }
      }
    })
  });

  const cancelSearch = () => {
    Keyboard.dismiss();
    setTextInputOnFocus(false);
  };
  
  const resetHomeScreen = () => {
    setResetIsClick(true);
    setSubmitIsClick(false);
    setFlashcardsFeed(flashcardsMaster);
    setFlashcardsCollection(flashcardsMaster.filter(flashcard => flashcard["created_by"] === userId));
  };

  useEffect(() => {
    if (resetIsClick) {
      setResetIsClick(false); // reset it
    }
  }, [resetIsClick]);

  const scrollToLeft = () => {
    scrollRef.current?.scrollTo({y:0, animated: true})
  };

  const scrollToRight = () => {
    scrollRef.current?.scrollToEnd({ animated: true});
  };

  // useEffect(() => {
  //   if (isFocused && !textInputOnFocus) {
  //     console.log('Hello')
  //   }
  // }, [isFocused, textInputOnFocus]);

  useEffect(() => {
      (async () => {
        if (isFocused) {
          try {
              console.log("it is focused now. HTTP request will be sent to backend");
              let flashcardsAll = await HTTPRequest.getFlashcards();
              const usersAll = await HTTPRequest.getUsers();
              
              // remove the deleted cards from the flashcards
              // cards with delete keyword in its created_by field are cards that deleted by their owners
              flashcardsAll = flashcardsAll.filter((card: any) => !card.created_by.includes("delete"));

              for (const card of flashcardsAll) {
                  const result = usersAll.find((user: any) => user.uuid === card.created_by);
                  if (result) {
                      card.created_by_username = result.user_name; // replace uid with username
                      card.avatar_url = result.avatar_url; // add field
                  }
                  card.created_timestamp = dayjs(card.created_timestamp).fromNow(); // https://day.js.org/docs/en/plugin/relative-time
              }
  
              const result: [] = flashcardsAll.reverse();

              setFlashcardsMaster(result);
              setFlashcardsFeed(result);
              setFlashcardsCollection(result.filter(flashcard => flashcard["created_by"] === userId));
          } catch (err) {
              console.log(err);
          }
        }
      })();
  }, [isFocused]);

  // update the home collection/feed states when the search is submitted
  useEffect(() => {
    if (flashcardsCurated && !textInputOnFocus) {
      // update the states for flashcardsFeed and flashcardsCollection
      setFlashcardsFeed(flashcardsCurated);
      setFlashcardsCollection(flashcardsCurated.filter(flashcard => flashcard["created_by"] === userId));
    }
  },[ flashcardsCurated, textInputOnFocus ]);

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


  const handleScroll = (e: object) => {
    const currentScrollPosition = e.nativeEvent.contentOffset.x;
    // console.log(currentScrollPosition);
    if (currentScrollPosition === 0) {
      setValue('feed');
    } else if (currentScrollPosition === width) {
      setValue('collection')
    }
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
    <View style={styles.master}>
      { !textInputOnFocus && flashcardsFeed && flashcardsCollection ? 
        <View>
          <SegmentedButtons
            value={value}
            onValueChange={setValue}
            buttons={[
              {
                value: 'feed',
                label: 'Feed',
                onPress: scrollToLeft
              },
              {
                value: 'collection',
                label: 'Collection',
                onPress: scrollToRight
              },
            ]}
            style={styles.segment}
          /> 
          <Divider />
          <ScrollView 
              horizontal 
              snapToInterval={width} 
              decelerationRate="fast" 
              showsHorizontalScrollIndicator={false}              
              ref={scrollRef}
              // https://stackoverflow.com/questions/29310553/is-it-possible-to-keep-a-scrollview-scrolled-to-the-bottom
              // onContentSizeChange={scrollToRight}
              // https://stackoverflow.com/questions/29503252/get-current-scroll-position-of-scrollview-in-react-native
              onScroll={handleScroll}
              onScrollEndDrag={handleScroll}
              scrollEventThrottle={16}
          >
          {flashcardsFeed.length > 0 ?
            <FlatList style={styles.container}
              data={flashcardsFeed}
              keyExtractor={(item) => item._id}
              renderItem={({item}) => (       
                  <Feed item={item} />
                )
              }
              contentContainerStyle={{paddingBottom: 200}}
            />
            : <Text style={styles.container}>result not found.</Text>
          }
            {flashcardsCollection.length > 0 ? 
              <FlatList style={styles.container}
                  data={flashcardsCollection}
                  keyExtractor={(item) => item._id}
                  renderItem={({item}) => (
                      <Collection item={item} />
                    )
                  }
                  // workaround for the last item of flatlist not showing properly
                  // https://thewebdev.info/2022/02/19/how-to-fix-the-react-native-flatlist-last-item-not-visible-issue/
                  contentContainerStyle={{paddingBottom: 200}}
                />
            : <Text style={styles.container}>result not found.</Text>
          }
        </ScrollView>
    </View>
        :
        <SearchBody 
          text={text} 
          setText={setText} 
          textInputOnFocus={textInputOnFocus}
          setTextInputOnFocus={setTextInputOnFocus}
          flashcardsCurated={flashcardsCurated}
        /> 
      }
  </View>
  );
};

const styles = StyleSheet.create({
  master: {
  },
  button: {
    alignItems: 'center',
  },
  container: {
    // marginTop: 20,
    width: width,
    flex: 1
  },
  segment: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'white'
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
  },
  image: {
      backgroundColor: 'transparent'
  },
  separator: {
      height: 0.2,
      backgroundColor: "grey"
  }
})