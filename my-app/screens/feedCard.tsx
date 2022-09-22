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
} from "react-native-paper";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ViewPagerAndroidComponent,
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

export const FeedCard = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [flashcard, setFlashcard] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [engDef, setEngDef] = useState("");
  const [hasSRSCard, setHasSRSCard] = useState(false);
  const [userSRSCards, setUserSRSCards] = useState<any[]>([]);
  const [flaggingUsers, setFlaggingUsers] = useState<any[]>([]);
  const [likers, setLikers] = useState<any[]>([]);
  // const [ haters, setHaters ] = useState<any[]>([]);
  const [liked, setLiked] = useState(false);
  const [hated, setHated] = useState(false);
  const [flashcardId, setFlashcardId] = useState("");
  const [reported, setReported] = useState(false);

  // const route = useRoute<RouteProp<Record<string, StackParamsList>, string>>();
  const route = useRoute<RouteProp<StackParamsList, "Card">>();
  const auth = getAuth();
  const userId: UserId = auth.currentUser?.uid;
  const isFocused = useIsFocused();

  useEffect(() => {
    axios
      .get(
        `https://tangoatsumare-api.herokuapp.com/api/flashcards/${route.params?.id}`
      )
      .then((response) => {
        setFlashcard(response.data[0]);
        setEngDef(response.data[0].Eng_meaning[0]);
        setFlashcardId(response.data[0]._id);
        setFlaggingUsers(response.data[0].flagging_users);
        checkIfReported();
        checkIfLiked();
      });
  }, []);

  useEffect(() => {
    if (isFocused && userId) {
      HTTPRequest.getSRSFlashcardsByUser(userId).then((flashcards) => {
        setUserSRSCards(flashcards);
        console.log("flashcards:", flashcards);
        setHasSRSCard(false);
        console.log("before check:", hasSRSCard);
        checkIfInDeck();
        // console.log("after check:", hasSRSCard)
      });
    }
  }, [isFocused]);

  const checkIfReported = () => {
    for (let user of flaggingUsers) {
      if (user === userId) {
        setReported(true);
      }
    }
  };

  const checkIfLiked = () => {
    for (let user of likers) {
      if (user === userId) {
        setLiked(true);
      }
    }
  };

  const checkIfInDeck = () => {
    //user users_to_cards_ joined with flashcards, loop through each entry checking the flashcard_id, if exists set state to true;
    if (userSRSCards) {
      for (let card of userSRSCards) {
        if (card.flashcard_id === flashcardId) {
          // console.log(card.flashcard_id)
          console.log("card", card);
          // console.log(flashcardId)
          setHasSRSCard(true);
        }
      }
    }
  };

  const likeButton = () => {
    if (liked === true) {
      return <Button icon="star">{likers.length} likes</Button>;
    } else {
      return (
        <Button
          icon="star"
          onPress={() => {
            {
              like();
            }
          }}
        >
          {likers.length} likes
        </Button>
      );
    }
  };

  const addCardToDeck = async () => {
    alert("add to deck");
    await HTTPRequest.addSRSCard({
      flashcard_id: flashcardId,
      user_id: userId,
      interval: 0,
      repetition: 0,
      efactor: 2.5,
      due_date: dayjs(Date.now()).toISOString(),
    });
  };

  const addToDeckButton = () => {
    if (hasSRSCard === true) {
      return <Button icon="bookshelf">In deck</Button>;
    } else {
      return (
        <Button
          icon="bookshelf"
          onPress={() => {
            {
              addCardToDeck();
            }
          }}
        >
          Add to deck
        </Button>
      );
    }
  };

  const report = async () => {
    alert("reported");
    const reporters = flaggingUsers;
    reporters.push(userId);
    await HTTPRequest.updateFlashCardProperties({ flaggingUsers: reporters });
    setReported(true);
  };

  const like = async () => {
    alert("liked");
    const likersArray = likers;
    likersArray.push(userId);
    await HTTPRequest.updateFlashCardProperties({ likers: likersArray });
    setReported(true);
  };

  const reportButton = () => {
    if (reported === true) {
      return <Button icon="emoticon-angry-outline">reported</Button>;
    } else {
      return (
        <Button
          icon="emoticon-angry-outline"
          onPress={() => {
            {
              report();
            }
          }}
        >
          report
        </Button>
      );
    }
  };

  const displayCard = (card: any) => {
    return (
      <View>
        <View style={styles.header}>
          <View style={styles.user}>
            <Avatar.Image
              size={35}
              source={card.avatar}
              style={styles.userLeft}
            />
            <View style={styles.userRight}>
              <Text variant="bodyLarge">{card.created_by}</Text>
              <Text variant="bodySmall">{card.created_timestamp}</Text>
            </View>
          </View>
          <Card style={styles.card}>
            <Card.Content>
              <Card.Cover
                source={{
                  uri: card.picture_url
                    ? card.picture_url
                    : "https://www.escj.org/sites/default/files/default_images/noImageUploaded.png",
                }}
                style={styles.image}
                resizeMode="contain"
              />
              <Title style={styles.textVocab}>{card.target_word}</Title>
              <Paragraph style={styles.text}>
                Sentence: {card.example_sentence}
              </Paragraph>
            </Card.Content>
          </Card>
        </View>
        <View style={styles.buttonGroup}>
          {likeButton()}
          {addToDeckButton()}
          {reportButton()}
        </View>
      </View>
    );
  };

  return <View style={styles.container}>{displayCard(flashcard)}</View>;
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    //   borderTopWidth: 0.2,
    //   borderTopColor: 'grey',
    borderBottomWidth: 0.2,
    borderBottomColor: "grey",
  },
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
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  segment: {},
  separator: {
    height: 0.2,
    backgroundColor: "grey",
  },
  text: {},
  textVocab: {
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    // marginTop: 2,
    // padding: 10
  },
  image: {
    backgroundColor: "transparent",
  },
  buttonGroup: {
    flexDirection: "row",
  },
});