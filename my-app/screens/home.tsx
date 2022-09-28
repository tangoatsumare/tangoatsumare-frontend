import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState, useRef, createRef, forwardRef, useCallback } from "react";
import { Keyboard, Dimensions, Animated, findNodeHandle, Image } from 'react-native';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { 
  ActivityIndicator, Text, Button, Card, Paragraph, Title, Avatar, Divider, Chip, Searchbar 
} from "react-native-paper";
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
  let scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();
  const onItemPress = useCallback(itemIndex => {
    if (itemIndex === 0) {
      scrollRef.current?.scrollTo({y:0});
    } else if (itemIndex === 1) {
      scrollRef.current?.scrollToEnd();
    }
  });

  const theme = useTheme();
  dayjs.extend(relativeTime);
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
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

  const [loading, setLoading] = useState(true);

  const [navigateTo, setNavigateTo] = useState({item: null}); 
  // from search view: navigate to feed card, reset navigateTo state
  useEffect(() => {
      if (selectedTags.length === 0 && text == '' && !textInputOnFocus && navigateTo.item) {
          navigation.navigate("FeedCard", navigateTo);
          setNavigateTo({item: null});
      }
  }, [selectedTags, text, textInputOnFocus, navigateTo]);

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
          scrollRef={scrollRef}
        />
      ),
      headerRight: () => {
        if (!textInputOnFocus && submitIsClick) {
          return (
            <TouchableOpacity 
                mode="text" 
                onPress={resetHomeScreen}
                style={{marginRight: 15}} // Hard coded
            >
              <Text variant="labelLarge" style={{color: 'black'}}>reset</Text>
              </TouchableOpacity>
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
              setLoading(false);
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
      // card.created_timestamp = dayjs(card.created_timestamp)
        // .fromNow(); 
      // https://day.js.org/docs/en/plugin/relative-time
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
      if (containerRef.current && scrollRef.current) {
        let m = [];
        data.forEach(item => {
          item.ref.current.measureLayout(
            containerRef.current, 
            (x, y, width, height) => {
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
    }, [containerRef.current, scrollRef.current]);
  
    return (
      <View 
        style={{
          position: 'absolute',
          top: 10,
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
          { 
            measures.length > 0 && 
            <Indicator measures={measures} scrollX={scrollX} />
          }
        </View>
      </View>
    );
  };

  const [currentView, setCurrentView] = useState("feed");
  const handleScroll = (event) => {
    if (event.nativeEvent.contentOffset.x === width) {
      setCurrentView("collection") 
      // this state update is causing this Home Component to refresh, 
      // causing the tab indicator to render.. not desirable
    } else if (event.nativeEvent.contentOffset.x === 0) {
      setCurrentView("feed"); // this is causing the tab indicator to render.. not desirable
    }
  };

  const CreateYourFirstCard = () => {
    return (
      <View style={{
        ...styles.container, 
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Text
        variant="bodyLarge"
      >
        Create your first Tango Flashcard
      </Text>
      <TouchableOpacity
        onPress={() => 
          navigation.navigate("Camera")
        }
        style={{
          marginTop: 20
        }}
      >
        <Button 
          mode="contained"
          style={{
            width: width / 2,
            padding: 5,
            borderRadius: 30,
            backgroundColor: theme.colors.primary,
            borderStyle: 'solid',
            borderWidth: 1.5,
            borderColor: theme.colors.primary
          }}
        >
          <Text
            variant="bodyLarge"
            style={{color: theme.colors.tertiary}}
          >Create</Text>
        </Button>
      </TouchableOpacity>
    </View>
    );
  }

  const NoSearchResultFound = () => {
    return (
      <View
        style={{
          ...styles.container, 
          marginTop: 100, // hard coded
          alignItems: 'center'
        }}
      >
        <Text
        >result not found.</Text>
      </View>
    );
  }

  const [ scrollContentChanged, setScrollContentChanged ] = useState(false);
  useEffect(() => {
    if (scrollContentChanged && currentView === 'collection') {
      console.log('hi');
      scrollRef.current.scrollToEnd();
    }
  }, [scrollContentChanged, currentView]);
  
  useEffect(() => {
    if (scrollContentChanged) setScrollContentChanged(false);
  }, [scrollContentChanged]);

  return (
    <View style={styles.master}>
      { !textInputOnFocus && flashcardsFeed && flashcardsCollection ? 
        <View> 
            {selectedTags.length !== 0 ? 
              <View style={styles.tagsContainer}>
                {selectedTags.map(item => {
                  return (
                    <Chip key={item} style={{...styles.tag, backgroundColor: theme.colors.primary}}>
                      <Text style={{fontSize: 10, color: 'white'}}>{item}</Text>
                    </Chip>
                  );
                })}
              </View>         
            :null}
          <Animated.ScrollView 
              contentContainerStyle={{ marginTop: selectedTags.length !== 0 ? 30 : 60 }}
              ref={scrollRef}
              horizontal 
              onContentSizeChange={() => { 
                // after search bar text input is not focused, 
                // force a scroll to the end if current view is collection
                // only fire if user is coming back from the search view to the collection/feed view
                setScrollContentChanged(true);
              }}
              onScroll={
                Animated.event(
                [{nativeEvent: {contentOffset: {x: scrollX}}}],
                {
                  useNativeDriver: false,
                  listener: event => {
                      handleScroll(event);
                  }
                })
              }
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
            : 
              <View style={{
                    width: width,
                    height: "100%",
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
              }}>
                {submitIsClick ? 
                  loading ? 
                    <ActivityIndicator /> : 
                    <NoSearchResultFound />
                    : 
                  loading ? 
                    <ActivityIndicator /> : 
                    <CreateYourFirstCard />
                }
              </View>
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
            : 
              submitIsClick ? 
                <NoSearchResultFound />
                 :  
                 <CreateYourFirstCard />
                                 
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
          navigateTo={navigateTo}
          setNavigateTo={setNavigateTo}
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
    marginTop: 60,
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