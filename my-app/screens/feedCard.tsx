import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import {
  Button,
  Card,
  Text,
  Chip,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Dimensions
} from "react-native";
import { Image } from 'react-native-expo-image-cache';
import {
  SRSTangoFlashcard,
} from "../utils/supermemo";
import { getAuth } from "@firebase/auth";
import { HTTPRequest } from "../utils/httpRequest";
import dayjs from "dayjs";
import { useTangoContext } from "../contexts/TangoContext";
import { useAuthContext } from "../contexts/AuthContext";

const {width, height} = Dimensions.get('screen');

export const FeedCard = ({route}) => {
  const { currentUser } = useAuthContext();
  const { tags, updateAppStates } = useTangoContext();
  const theme = useTheme();
  // const [engDef, setEngDef] = useState("");
  const [hasSRSCard, setHasSRSCard] = useState(false);
//make a variable and just check once on load
  const [flaggingUsers, setFlaggingUsers] = useState<any[]>([]);
  //make a variable and just check once on load
  const [likers, setLikers] = useState<any[]>([]);
  // const [ haters, setHaters ] = useState<any[]>([]);
  const [liked, setLiked] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");
  const [userName, setUserName] = useState("");
  // const [item._id, setFlashcardId] = useState("");
  const [reported, setReported] = useState(false);
  const [matchingTags, setMatchingTags] = useState<string[]>([]);

  const {item} = route?.params;
  // const auth = getAuth();
  const userId = currentUser.uid;
  let currentUserId;

  useEffect(() => {
    if (item) {
      (async () => {
          try {
            const flaggersArray = item.flagging_users
            checkIfReported(flaggersArray);
            const likersArray = item.likers;
            checkIfLiked(likersArray);
            setLikers(item.likers);
            currentUserId = item.created_by;
  
            //fetch all of the users SRS To Cards data, to see if the card already exists in the users deck
            let userToSRSCards: SRSTangoFlashcard[] = await HTTPRequest.getSRSFlashcardsByUser(userId);
            // const userToSRSCards = await axios.get(`https://tangoatsumare-api.herokuapp.com/api/cardflashjoinuid/${userId}`)
            const FCId = item._id;
            checkIfInDeck(userToSRSCards, FCId);
                  
            //fetch the users data for username and avatar display
            const user = await HTTPRequest.getUserByUserId(currentUserId);
            const userName = user.user_name;
            const avatar = user.avatar_url;
            setUser(userName, avatar);

            // const tagsData = await HTTPRequest.getTags(); // fetching hashtag data
            const tagsOfCard: string[] = [];
            for (const tag of item.tags) {
              const result = tags.find(data => data._id === tag).tag;
              if (result) tagsOfCard.push(result);
            }
            setMatchingTags(tagsOfCard);

          } catch (err) {
              console.log(err);
          }
        }
      )();
    }
  }, [item]);

  function setUser (name: any, uri: any){
    setUserName(name);
    setUserAvatar(uri);
  }
  //Liking the card
//run on load, check to see if this user has already liked the card
  function checkIfLiked (array: any) {
    for (let user of array) {
      if (user === userId) {
        setLiked(true);
      }
      setLikers(array)
    }
  };

  //run on load, check to see if this user has already added the card their SRS deck
  function checkIfInDeck(arrayOfSRSCards: any, id: any) {
    //user users_to_cards_ joined with flashcards, loop through each entry checking the flashcard_id, if exists set state to true;
      for (let card of arrayOfSRSCards) {
        if (card.flashcard_id === id) {
          // console.log(item._id)
          setHasSRSCard(true);
        }
    }
  };

  //run on load, check to see if this user has already reported the card
function checkIfReported (array: any) {
    for (let user of array) {
      if (user === userId) {
        setReported(true);
      }
    }
    setFlaggingUsers(array)
  };

 //a function to like the card if the user has not liked it already
  const like = async () => {
    const likersArray = likers;
    likersArray.push(userId);
    try {
      await HTTPRequest.updateFlashcardProperties(item._id, { likers: likersArray });
      console.log('liked');
      setLiked(true);
            // TODO: update the states for the flashcards
            // get the latest info for this card from the endpoint
            // update the state for flashcards: 
              // metrics
              // SRSFlashcardsOfCurrentUser
              // flashcardsReviewable            
      await updateAppStates();
    } catch (err) {
      console.log(err);
    }
  };

  //Adding to users SRS DECK

   //a function to add the card to the users SRS deck if the user has not already added it
   const addCardToDeck = async () => {
     try {
       await HTTPRequest.addSRSCard({
         flashcard_id: item._id,
         uid: userId,
         counter: 0,
         interval: 0,
         repetition: 0,
         efactor: 2.5,
         due_date: dayjs(Date.now()).toISOString(),
       });
      console.log("added to deck");
      setHasSRSCard(true);
      await updateAppStates();
     } catch(err) {
       console.log(err);
     }
  };

//Reporting inappropriate cards

 //a function to report  the card if the user has not reported it already
 const report = async () => {
    const reporters = flaggingUsers;
    reporters.push(userId);
    try {
      if (reporters.length >= 3){
        await HTTPRequest.updateFlashcardProperties(item._id, { 
          flagging_users: reporters,
          flagged_inappropriate: true
        });
        console.log("reported");
        setReported(true);
        await updateAppStates();
      } else {
        await HTTPRequest.updateFlashcardProperties(item._id, { 
          flagging_users: reporters
        });
        console.log("reported");
        setReported(true);
        await updateAppStates();
      }
    } catch(err) {
      console.log(err);
    }
  };
 
  const ButtonGroup = () => {
    return (
      <View style={styles.buttonGroup}>
          <TouchableOpacity
            onPress={!reported? report: () => {}}
            disabled={reported ? true: false}
          >
            <Button 
              icon="flag-variant-outline"
              labelStyle={{color: reported? theme.colors.primary: 'black'}}
            >
              <Text
                style={{color: reported? theme.colors.primary: 'black'}}
              >
                {reported? "reported": "Report"}
              </Text>
            </Button>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={!hasSRSCard? addCardToDeck: () => {}}
            disabled={hasSRSCard ? true: false}
          >
            <Button 
              icon="book-plus-multiple-outline"
              labelStyle={{color: hasSRSCard? theme.colors.primary: 'black'}}
            >
              <Text
                style={{color: hasSRSCard? theme.colors.primary: 'black'}}
              >
                {hasSRSCard? "In deck": "Add to deck"}
              </Text>
            </Button>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={!liked? like: () => {}}
            disabled={liked ? true: false}
          >
            <Button 
              icon="butterfly-outline"
              labelStyle={{color: liked? theme.colors.primary: 'black'}}
            >
              <Text
                style={{color: liked? theme.colors.primary: 'black'}}
              >
                {likers.length} likes
              </Text>
            </Button>
          </TouchableOpacity>
        </View>
    );
  }

  const DisplayCard = ({flashcard}: any) => {
    const [loadingProfileImg, setLoadingProfileImg] = useState<boolean>(true);
    const [loadingCardImg, setLoadingCardImg] = useState<boolean>(true);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      if (!loadingProfileImg && !loadingCardImg) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }).start();
      }
    }, [loadingCardImg, loadingProfileImg]);

    return (
        <Animated.ScrollView
          contentContainerStyle={{
            // justifyContent: 'center',
            alignItems: 'center',
          }}
          style={{
            // opacity: fadeAnim,
            backgroundColor: "white",
            paddingLeft: 30,
            paddingRight: 30
          }}
        >
          <View style={styles.header}>
            <View style={styles.user}>
              {/* <Avatar.Image
                size={35}
                onLoadEnd={() => {
                  setLoadingProfileImg(false)
                }}
                source={{ 
                  uri: userAvatar? userAvatar: 'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png' 
              }}               
              style={styles.userLeft}
              /> */}
                <Image 
                    preview={userAvatar}
                    uri={userAvatar}
                    style={styles.userLeft}
                  />
              <View style={styles.userRight}>
                <Text variant="bodyLarge">{userName}</Text>
                <Text variant="bodySmall">{dayjs(item.created_timestamp).fromNow()}</Text>
              </View>
            </View>
            <Card style={styles.card} mode="contained">
              <Card.Content>
                <Image 
                  preview={item.picture_uri}
                  uri={item.picture_url}
                  style={styles.image}
                />
                {/* <Card.Cover
                  onLoadEnd={() => setLoadingCardImg(false)}
                  source={{
                    uri: flashcard.picture_url
                      ? flashcard.picture_url
                      : "https://www.escj.org/sites/default/files/default_images/noImageUploaded.png",
                  }}
                  style={styles.image}
                  resizeMode="contain"
                /> */}
                <ButtonGroup />
                <View style={{paddingTop: 50}}>
                  <Text style={styles.textVocab} variant="displayLarge">{item.target_word}</Text>
                  <Text style={styles.text} variant="displayMedium">{item.Eng_meaning}</Text>
                  <Text style={styles.text} variant="headlineMedium">{item.example_sentence}</Text>
                </View>
                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  {matchingTags.length > 0 ? matchingTags.map(tag => {
                    return (
                      <Chip 
                        key={tag} 
                        style={{
                          margin: 5, 
                          borderRadius: 20, 
                          backgroundColor: '#FF4F4F'
                        }}
                        textStyle={{
                          color: 'white'
                        }}
                      >{tag}</Chip>
                    );
                  })
                  : null}
                </View>
              </Card.Content>
            </Card>
          </View>
        </Animated.ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {userAvatar && userName && matchingTags ?
        <DisplayCard flashcard={item}/>
        :
        <ActivityIndicator />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  header: {},
  user: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
    marginTop: 10,
  },
  userLeft: {
    borderRadius: 25,
    marginRight: 10,
    height: 50,
    width: 50,
  },
  userRight: {
    alignItems: "flex-start",
  },
  username: {},
  button: {
    alignItems: "center",
  },
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: 'white'
  },
  segment: {},
  separator: {
    height: 0.2,
    backgroundColor: "grey",
  },
  text: {
    textAlign: "center",
  },
  textVocab: {
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "transparent",
  },
  image: {
    // height: '60%',
    height: width - 100,
    width: width - 100,
    backgroundColor: "transparent",
    borderRadius: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    // flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center'
  },
});