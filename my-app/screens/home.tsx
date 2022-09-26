import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState, useRef, createRef, forwardRef, useCallback } from "react";
import { Keyboard, Dimensions, Animated, findNodeHandle, Image } from 'react-native';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { SegmentedButtons, Text, Button, Card, Paragraph, Title, Avatar, Divider, Chip, Searchbar } from "react-native-paper";
import { useTheme } from 'react-native-paper';
import { HTTPRequest } from "../utils/httpRequest";
import { SearchBar, SearchBody } from '../screens/Search';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getAuth } from 'firebase/auth';
import { Collection } from "../Components/collection";
import { Feed } from "../Components/feed";

const { width, height } = Dimensions.get('screen');

export interface Tag {
  _id: string,
  tag: string,
  flashcards: string[]
}

type SegmentedButtonsValue = 'feed' | 'collection'

// NEW
// implementation of animated tab indicator
// https://www.youtube.com/watch?v=ZiSN9uik6OY&t=464s
const views = {
  feed: 'Feed',
  collection: 'Collection'
};

const data = Object.keys(views).map((i) => ({
  key: i,
  title: views[i],
  ref: createRef()
}));

export const Home = () => {
  // for animated indicator
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();
  const onItemPress = useCallback(itemIndex => {
    if (itemIndex === 0) {
      scrollRef.current?.scrollTo({y:0})
    } else if (itemIndex === 1) {
      scrollRef.current?.scrollToEnd()
    }
  });

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

  // const scrollRef = useRef();

  // setting the header section
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: 'white' // TO CHANGE: per figma variable
      },
      headerShadowVisible: false,
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
        // if (textInputOnFocus) {
        //   return (
        //     <Button 
        //         mode="text" 
        //         onPress={cancelSearch}
        //         style={{marginLeft: 5}}
        //     >
        //       <Text variant="labelLarge" style={{color: 'black'}}>cancel</Text>
        //       </Button>
        //   );
        // } else 
        if (!textInputOnFocus && submitIsClick) {
          return (
            <Button 
                mode="text" 
                onPress={resetHomeScreen}
                style={{marginLeft: 5}}
            >
              <Text variant="labelLarge" style={{color: 'black'}}>reset</Text>
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
              //remove flagged cards
              flashcardsAll = flashcardsAll.filter((card: any) => (!card.flagged_inappropriate));
  
              flashcardsAll = filterOutDeletedFlashcardsFromFlashcards(flashcardsAll);
          
              // TODO: filter by flags

              const formattedFlashcards = formatFlashcardRelatedUserDetails(flashcardsAll, usersAll);
              const result: any[] = formattedFlashcards.reverse();

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

  // useEffect(() => {
  //   if (tagsToFlashcards) {
  //     console.log(tagsToFlashcards);
  //   }
  // }, [tagsToFlashcards]);

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

  const Tab = forwardRef(({item, onItemPress}, ref) => {
    return (
      <TouchableOpacity onPress={onItemPress}>
        <View ref={ref}>
          <Text 
            style={{
              color: 'black', 
              fontSize: 40 / data.length, 
              fontWeight: '600', // TO CHANGE: per Figma variable
              // textTransform: 'uppercase'
            }}
          >{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  });
  
  const Indicator = ({measures, scrollX}) => {
    const inputRange = data.map((_, i) => i * width);
    const indicatorWidth = scrollX.interpolate({
      inputRange,
      outputRange: measures.map(measure => measure.width),
    });
    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: measures.map(measure => measure.x),
    });
    return (
      <Animated.View
        style={{
          position: 'absolute',
          height: 4,
          width: indicatorWidth,
          left: 0,
          backgroundColor: theme.colors.primary,
          bottom: -10,
          transform: [{
            translateX
          }]
        }}
      />
    );
  }
  
  const Tabs = ({data, scrollX, onItemPress}) => {
    const [measures, setMeasures] = useState([]);
    const containerRef = useRef();
    // TO FIX: this useEffect needs to fire after the main components are mounted
    useEffect(() => {
      if (containerRef.current) {
        let m = [];
        data.forEach(item => {
          item.ref.current.measureLayout(
            containerRef.current, 
            (x, y, width, height) => {
              // console.log(x, y, width, height);
              m.push({
                x, y, width, height
              });
  
              if (m.length === data.length) {
                setMeasures(m);
              }
            }
          )
        })
      }
    }, [containerRef.current]);
  
    // console.log(measures);
  
    return (
      <View 
        style={{
          // flex:1, 
          position: 'absolute',
          top: 5,
          // marginBottom: 20,
          width
        }}
      >
        <View
          ref={containerRef}
          style={{
            justifyContent: 'space-evenly',
            flex: 1,
            flexDirection: 'row',
          }}
        >
          {data.map((item, index) => {
            return <Tab key={item.key} item={item} ref={item.ref} onItemPress={() => onItemPress(index)} />;
          })}
          {measures.length > 0 && <Indicator measures={measures} scrollX={scrollX} />}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.master}>
      { !textInputOnFocus && flashcardsFeed && flashcardsCollection ? 
        <View> 
            {selectedTags.length !== 0 ? 
              <View style={styles.tagsContainer}>
                {selectedTags.map(item => {
                  return (
                    <Chip key={item} style={{...styles.tag, backgroundColor: theme.colors.primary}}>
                      <Text style={{fontSize: 10}}>{item}</Text>
                    </Chip>
                  );
                })}
              </View>         
            :null}
          <Animated.ScrollView 
              contentContainerStyle={{ marginTop: selectedTags.length !== 0 ? 20 : 50 }}
              ref={scrollRef}
              horizontal 
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {x: scrollX}}}],
                { useNativeDriver: false }
                )}
              pagingEnabled={true}
              decelerationRate="fast" 
              showsHorizontalScrollIndicator={false}              
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
              contentContainerStyle={{paddingBottom: 50}}
              showsVerticalScrollIndicator={false}
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
                  contentContainerStyle={{paddingBottom: 50}}
                  showsVerticalScrollIndicator={false}
                />
            : <Text style={styles.container}>{submitIsClick ? "result not found." : "no entry"}</Text>
          }
        </Animated.ScrollView>
        <Tabs scrollX={scrollX} data={data} onItemPress={onItemPress}/>
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
    flex: 1,
    backgroundColor: 'white'
  },
  tagsContainer: {
    marginTop: 50,
    paddingLeft: 10,
    paddingRight: 10,
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
  container: {
    width: width,
    flex: 1,
  },
});