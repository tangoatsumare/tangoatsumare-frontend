import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { Keyboard, Dimensions } from 'react-native';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { SegmentedButtons, Text, Button, Card, Paragraph, Title, Avatar, Divider, Chip } from "react-native-paper";
import { useTheme } from 'react-native-paper';
// import { Collection } from "../Components/collection";
// import { Feed } from "../Components/feed";
import { HTTPRequest } from "../utils/httpRequest";
import { SearchBar, SearchBody } from '../screens/Search';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getAuth } from 'firebase/auth';

const { width } = Dimensions.get('window');

export interface Tag {
  _id: string,
  tag: string,
  flashcards: string[]
}

type SegmentedButtonsValue = 'feed' | 'collection'

export const Home = () => {
  const theme = useTheme();
  dayjs.extend(relativeTime);
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [value, setValue] = useState<SegmentedButtonsValue>('feed'); // segmented button's value: feed / collection
  const [text, setText] = useState<string>('');
  const [textInputOnFocus, setTextInputOnFocus] = useState<boolean>(false);
  const [flashcardsMaster, setFlashcardsMaster] = useState<object[]>([]);
  const [flashcardsCurated, setFlashcardsCurated] = useState<object[]>([]);
  const [flashcardsCollection, setFlashcardsCollection] = useState<object[]>([]);
  const [flashcardsFeed, setFlashcardsFeed] = useState<object[]>([]);
  const [resetIsClick, setResetIsClick] = useState<boolean>(false);
  const [submitIsClick, setSubmitIsClick] = useState<boolean>(false);

  const [tags, setTags] = useState<Tag[]>([]);
  const [tagsToFlashcards, setTagsToFlashcards] = useState<object>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hashTagSearchMode, setHashTagSearchMode] = useState<boolean>(false);

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
          hashTagSearchMode={hashTagSearchMode}
          setHashTagSearchMode={setHashTagSearchMode}
          handleEditSubmit={handleEditSubmit}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          tagsToFlashcards={tagsToFlashcards}
          tags={tags}
          setTags={setTags}
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

  useEffect(() => {
    if (resetIsClick) {
      setResetIsClick(false); // reset it
    }
  }, [resetIsClick]);

  // clear previously saved text & selected tags whenever the search bar is focused
  useEffect(() => {
    if (textInputOnFocus) {
      setSelectedTags([]);
    }
  }, [textInputOnFocus]);

  useEffect(() => {
      (async () => {
        if (isFocused) {
          try {
              console.log("it is focused now. HTTP request will be sent to backend");

              let flashcardsAll = await HTTPRequest.getFlashcards();
              const usersAll = await HTTPRequest.getUsers();
              const tagsData = await HTTPRequest.getTags(); // fetching hashtag data

              // remove the deleted cards from the flashcards
              // cards with delete keyword in its created_by field are cards that deleted by their owners
              flashcardsAll = flashcardsAll.filter((card: any) => !card.created_by.includes("delete"));
              //remove flagged cards
              flashcardsAll = flashcardsAll.filter((card: any) => (!card.flagged_inappropriate));


              // for (const card of flashcardsAll) {
              //     const result = usersAll.find((user: any) => user.uuid === card.created_by);
              //     if (result) {
              //         card.created_by_username = result.user_name; // replace uid with username
              //         card.avatar_url = result.avatar_url; // add field
              //     }
              //     card.created_timestamp = dayjs(card.created_timestamp).fromNow(); // https://day.js.org/docs/en/plugin/relative-time
              // }
  
              flashcardsAll = filterOutDeletedFlashcardsFromFlashcards(flashcardsAll);
          
              // TODO: filter by flags

              const formattedFlashcards = formatFlashcardRelatedUserDetails(flashcardsAll, usersAll);
              const result: any[] = formattedFlashcards.reverse();

              // <---- TO TEST AND DEBUG ---->
              // mock data for testing the hashtags
              // per Schema,
              // each tag from the tagsData has a flashcards array field, containing flashcard_id 
              
              // Uncomment the code to test them

              // Test 1: pick the first flashcard from the pool, pick the first hashtag from the pool
              // seed that flashcard id into the tag's flashcard array
              // const testFlashcard = flashcardsAll[0];
              // console.log(testFlashcard._id)
              // tagsData[0].flashcards.push(testFlashcard._id);
              // End of Test 1

              // // Test 2: pick 1 card. Seed 2 tags into it
              // const testFlashcard = flashcardsAll[0];
              // tagsData[0].flashcards.push(testFlashcard._id);
              // tagsData[1].flashcards.push(testFlashcard._id);
              // // End of Test 2

              // // Test 3: pick 2 cards. Seed the same tag into them
              // const testFlashcard1 = flashcardsAll[0];
              // const testFlashcard2 = flashcardsAll[1];
              // tagsData[0].flashcards.push(testFlashcard1._id);
              // tagsData[0].flashcards.push(testFlashcard2._id);
              // // End of Test 3

              // Test 4: pick 2 cards. Seed 2 different tags into them
              // const testFlashcard1 = flashcardsAll[2];
              // const testFlashcard2 = flashcardsAll[3];
              // tagsData[2].flashcards.push(testFlashcard1._id);
              // tagsData[2].flashcards.push(testFlashcard2._id);
              // tagsData[3].flashcards.push(testFlashcard1._id);
              // tagsData[3].flashcards.push(testFlashcard2._id);
              // End of Test 4

              // setting states
              setTags(tagsData);
              setTagsToFlashcards(getTagsToFlashcardsIdObject(tagsData));
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
      setFlashcardsCollection(flashcardsCurated.filter(flashcard => flashcard.created_by === userId));
    }
  },[ flashcardsCurated, textInputOnFocus ]);

  useEffect(() => {
    if (tagsToFlashcards) {
      console.log(tagsToFlashcards);
    }
  }, [tagsToFlashcards]);

  const cancelSearch = () => {
    setText('');
    clearKeyboard();
  };

  const clearKeyboard = () => {
    Keyboard.dismiss();
    setTextInputOnFocus(false);
  };
  
  const resetHomeScreen = () => {
    setText('');
    setSelectedTags([]);
    setResetIsClick(true);
    setSubmitIsClick(false);
    setFlashcardsFeed(flashcardsMaster);
    setFlashcardsCollection(flashcardsMaster.filter(flashcard => flashcard["created_by"] === userId));
  };

  const scrollToLeft = () => {
    scrollRef.current?.scrollTo({y:0, animated: true})
  };

  const scrollToRight = () => {
    scrollRef.current?.scrollToEnd({ animated: true});
  };

  // reshape the object so it is easier to work with
  const getTagsToFlashcardsIdObject = (tags: Tag[]): object => {
    const tagsToFlashcardsId = {};
    for (const tag of tags) {
      // https://stackoverflow.com/questions/11508463/javascript-set-object-key-by-variable
        tagsToFlashcardsId[tag.tag] = tag.flashcards;

    }
    return tagsToFlashcardsId;
  }

  const formatFlashcardRelatedUserDetails = (cards: any[], users: any[]): any[] => {
    const formattedCards = [...cards];
    for (const card of cards) {
      const result = users.find((user: any) => user.uuid === card.created_by);
      if (result) {
          card.created_by_username = result.user_name; // replace uid with username
          card.avatar_url = result.avatar_url; // add field
      }
      card.created_timestamp = dayjs(card.created_timestamp).fromNow(); // https://day.js.org/docs/en/plugin/relative-time
    }
    return formattedCards;
  };

  const filterOutDeletedFlashcardsFromFlashcards = (cards: any[]): any[] => {
    // cards with delete keyword in its created_by field are cards that deleted by their owners
    return cards.filter((card: any) => !card.created_by.includes("delete"));
  }

  const handleShowFlashcard = (flashcardID: string) => {
    navigation.navigate("Card", {id: flashcardID})
    console.log(flashcardID);
  }

  const handleShowFeedcard = (flashcardID: string) => {
    navigation.navigate("FeedCard", {id: flashcardID})
    console.log(flashcardID);
  }


  const handleScroll = (e: object) => {
    const currentScrollPosition = e.nativeEvent.contentOffset.x;
    if (currentScrollPosition === 0) {
      setValue('feed');
    } else if (currentScrollPosition === width) {
      setValue('collection')
    }
  };

  const handleEditSubmit = () => {
    if (text || selectedTags.length !== 0) {
        const searchParams = {
          text,
          selectedTags
        };
        console.log(searchParams);
        setSubmitIsClick(true);
        clearKeyboard(); // change the screen back to the feed/collection  
    } else {
        console.log('search not executed due to empty string');
    }
};

  const Feed = ({item}) => {
    return (
      <View style={styles.item}>
        <TouchableOpacity 
            onPress={() => { handleShowFeedcard(item._id) }}
        >
            <View style={styles.header}>
                <View style={styles.user}>
                    {/* <Avatar.Image 
                    size={35} 
                    source={{ 
                        uri: item.avatar_url? item.avatar_url: 'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png' 
                    }} 
                    style={styles.userLeft}/> */}
                    {/* <View style={styles.userRight}>
                        <Text variant="bodyLarge">{item.created_by_username}</Text>
                        <Text variant="bodySmall">{item.created_timestamp}</Text>
                    </View> */}
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
                        {/* <Paragraph style={styles.text}>Sentence: {item.example_sentence}</Paragraph> */}
                    </Card.Content>
                    <Card.Actions>
                    </Card.Actions>
                </Card>
                <Title style={styles.textVocab}>{item.target_word}</Title>
            </View>
        </TouchableOpacity>
        {/* <View style={styles.buttonGroup}>
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
        </View> */}
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
          <View style={styles.tagsContainer}>
            {selectedTags.length !== 0 ? 
              selectedTags.map(item => {
                return (
                  <Chip key={item} style={{...styles.tag, backgroundColor: theme.colors.secondary}}>
                    <Text style={{fontSize: 10}}>{item}</Text>
                  </Chip>
                );
              })
            :null}
          </View>
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
              numColumns={2}
              key={'_'}
              keyExtractor={(item) => "_" + item._id}
              renderItem={({item}) => (       
                  <Feed item={item} />
                )
              }
              contentContainerStyle={{paddingBottom: 200}}
            />
            : <Text style={styles.container}>{submitIsClick ? "result not found." : "no entry"}</Text>
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
            : <Text style={styles.container}>{submitIsClick ? "result not found." : "no entry"}</Text>
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
          hashTagSearchMode={hashTagSearchMode}
          setHashTagSearchMode={setHashTagSearchMode}
          handleEditSubmit={handleEditSubmit}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          tags={tags}
          setTags={setTags}
        /> 
      }
  </View>
  );
};

const styles = StyleSheet.create({
  master: {
    flex: 1
  },
  tagsContainer: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width,
  },
  tag: {
    width: 75,
    height: 30,
    margin: 2,
    borderRadius: 30,
    alignItems: 'center'
  },
  button: {
    alignItems: 'center',
  },
  container: {
    width: width,
    flex: 1
  },
  segment: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  item: {
    // padding: 10,
    width: width / 2,
    // borderBottomWidth: 0.2,
    // borderBottomColor: 'grey'
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