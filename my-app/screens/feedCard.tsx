import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import {
  Avatar,
  Button,
  Card,
  Paragraph,
  Title,
  Text,
  Chip,
  useTheme,
} from "react-native-paper";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ViewPagerAndroidComponent,
  Animated
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/core";
import { ScreenRouteProp, StackParamsList } from "../library/routeProp";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
import {
  initializeSRSFlashcard,
  SRSTangoFlashcard,
  TangoFlashcard,
} from "../utils/supermemo";
import { getAuth } from "@firebase/auth";
import { HTTPRequest, UserId } from "../utils/httpRequest";
import { useIsFocused } from "@react-navigation/native";
import { report } from "process";
import dayjs from "dayjs";
import { mdiCardsPlayingSpadeMultiple } from "@mdi/js";

export const FeedCard = ({route}) => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [flashcard, setFlashcard] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [engDef, setEngDef] = useState("");
  const [hasSRSCard, setHasSRSCard] = useState(false);
//   const [userSRSCards, setUserSRSCards] = useState<any[]>([]);
//make a variable and just check once on load
  const [flaggingUsers, setFlaggingUsers] = useState<any[]>([]);
  //make a variable and just check once on load
  const [likers, setLikers] = useState<any[]>([]);
  // const [ haters, setHaters ] = useState<any[]>([]);
  const [liked, setLiked] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [flashcardId, setFlashcardId] = useState("");
  const [reported, setReported] = useState(false);
  const [date, setDate] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // const route = useRoute<RouteProp<Record<string, StackParamsList>, string>>();
  // const route = useRoute<RouteProp<StackParamsList, "Card">>();
  const {item} = route?.params;
  // console.log(item._id);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  // let userId;
  let currentUserId;
  const isFocused = useIsFocused();


  useEffect(() => {
    if (item) {
      (async () => {
          try {
            setFlashcard(item);
            setEngDef(item.Eng_meaning[0]);
            setFlashcardId(item._id);
            const newDate = dayjs(item.created_timestamp).fromNow();
            // .format('DD/MM/YYYY');
            setDate(newDate)
            const flaggersArray = item.flagging_users
            checkIfReported(flaggersArray);
            const likersArray = item.likers
            checkIfLiked(likersArray);
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

            const tagsData = await HTTPRequest.getTags(); // fetching hashtag data
            // console.log(item.tags);
            // console.log(tagsData);
            const tagsOfCard: string[] = [];
            for (const tag of item.tags) {
              const result = tagsData.find(data => data._id === tag).tag;
              if (result) tagsOfCard.push(result);
            }
            setTags(tagsOfCard);

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
        console.log("user:", user)
        console.log("userID:", userId)
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
          // console.log(flashcardId)
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
    // await HTTPRequest.updateFlashCardProperties({ likers: likersArray });
    await axios.patch(`https://tangoatsumare-api.herokuapp.com/api/flashcards/${flashcardId}`, { 
        likers: likersArray
     })
        .then(res => alert("liked"))
        .catch(err => console.log(err));
    setLiked(true);
  };

//Adding to users SRS DECK


   //a function to add the card to the users SRS deck if the user has not already added it
   const addCardToDeck = async () => {
    alert("add to deck");
    await HTTPRequest.addSRSCard({
      flashcard_id: flashcardId,
      uid: userId,
      counter: 0,
      interval: 0,
      repetition: 0,
      efactor: 2.5,
      due_date: dayjs(Date.now()).toISOString(),
    });
    setHasSRSCard(true)
  };

//Reporting inappropriate cards

 //a function to report  the card if the user has not reported it already
 const report = async () => {
    const reporters = flaggingUsers;
    reporters.push(userId);
    if (reporters.length >= 3){
        await axios.patch(`https://tangoatsumare-api.herokuapp.com/api/flashcards/${flashcardId}`, { 
            flagging_users: reporters,
            flagged_inappropriate: true
         }) 
         .then(res => alert("reported"))
         .catch(err => console.log(err));
     setReported(true);
    } else {
        await axios.patch(`https://tangoatsumare-api.herokuapp.com/api/flashcards/${flashcardId}`, { 
            flagging_users: reporters
         })
            .then(res => alert("reported"))
            .catch(err => console.log(err));
        setReported(true);
    }
  };
 
  const ButtonGroup = () => {
    return (
      <View style={styles.buttonGroup}>
          { reported === true ?
            <Button 
              icon="flag-variant-outline"
              labelStyle={{color: theme.colors.primary}}
            >reported</Button>
          :
            <Button
              icon="flag-variant-outline"
              onPress={report}
              labelStyle={{color: 'black'}}
            >
              Report Inappropriate
            </Button>
          }
          { hasSRSCard ? 
            <Button 
              icon="book-plus-multiple-outline"
              labelStyle={{color: theme.colors.primary}}
            >
              In deck
            </Button> 
          : 
            <Button
              icon="book-plus-multiple-outline"
              onPress={addCardToDeck}
              labelStyle={{color: "black"}}
            >
              Add to deck
            </Button>
          }
          { liked === true?
            <Button 
              icon="butterfly-outline"
              labelStyle={{color: theme.colors.primary}}
            >{likers.length} likes</Button>
          :
            <Button
              icon="butterfly-outline"
              onPress={like}
              labelStyle={{color: "black"}}
            >
            {likers.length} likes
            </Button>
          }
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
        <Animated.View
          style={{
            // flex: 1,
            opacity: fadeAnim,
            backgroundColor: "white",
            paddingLeft: 30,
            paddingRight: 30
          }}
        >
          <View style={styles.header}>
            <View style={styles.user}>
              <Avatar.Image
                size={35}
                onLoadEnd={() => {
                  setLoadingProfileImg(false)
                }}
                source={{ 
                  uri: userAvatar? userAvatar: 'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png' 
              }}               
              style={styles.userLeft}
              />
              <View style={styles.userRight}>
                <Text variant="bodyLarge">{userName}</Text>
                <Text variant="bodySmall">{date}</Text>
              </View>
            </View>
            <Card style={styles.card} mode="contained">
              <Card.Content>
                <Card.Cover
                  onLoadEnd={() => setLoadingCardImg(false)}
                  source={{
                    uri: flashcard.picture_url
                      ? flashcard.picture_url
                      : "https://www.escj.org/sites/default/files/default_images/noImageUploaded.png",
                  }}
                  style={styles.image}
                  resizeMode="contain"
                />
                <ButtonGroup />
                <View style={{paddingTop: 50}}>
                  <Text style={styles.textVocab} variant="displayLarge">{flashcard.target_word}</Text>
                  <Text style={styles.text} variant="displayMedium">{flashcard.Eng_meaning}</Text>
                  <Text style={styles.text} variant="headlineMedium">{flashcard.example_sentence}</Text>
                </View>
                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  {tags.length > 0 ? tags.map(tag => {
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
        </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {flashcard && userAvatar && userName && date && likers && tags && 
        <DisplayCard flashcard={flashcard}/>
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
    marginRight: 10,
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
    backgroundColor: "transparent",
    borderRadius: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center'
  },
});