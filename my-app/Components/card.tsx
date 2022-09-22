import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase, RouteProp } from '@react-navigation/native'
import { Card, Paragraph, Title, Button, Dialog, Portal } from "react-native-paper";
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native'
import axios from 'axios'
import { useRoute } from '@react-navigation/core'
import { ScreenRouteProp, StackParamsList } from "../library/routeProp";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
import { getAuth } from 'firebase/auth';


export const SingleCard = () => {

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const auth = getAuth();
  const userUid = auth.currentUser?.uid;


  const [flashcard, setFlashcard] = useState({})
  const [imageUrl, setImageUrl] = useState<string>("")
  const [usersFlashcard, setUsersFlashcard] = useState<boolean>(false);
  const [pressDelete, setPressDelete] = useState<boolean>(false);
  const [flashcardId, setFlashcardId] = useState<string>('');

  const [engDef, setEngDef] = useState<string>('')

  // const route = useRoute<RouteProp<Record<string, StackParamsList>, string>>();
  const route = useRoute<RouteProp<StackParamsList, 'Card'>>();



  useEffect(() => {
    axios
      .get(`https://tangoatsumare-api.herokuapp.com/api/flashcards/${route.params?.id}`)
      .then((response) => {
        setFlashcard(response.data[0])
        setEngDef(response.data[0].Eng_meaning[0])
        setFlashcardId(response.data[0]._id)

        if (response.data[0].created_by === userUid) {
          setUsersFlashcard(true);
        }
      });
  }, []);

  useEffect(() => {
    (async () => {
      if (pressDelete) {
        const id = flashcardId;
        const body = { created_by: 'delete_' + id }
        await axios.patch(`https://tangoatsumare-api.herokuapp.com/api/flashcards/${id}`, body)
          .then(res => console.log("success"))
          .catch(err => console.log(err));
      }
    })();
  }, [pressDelete])


  const displayCard = (card: any) => {
    return (
      <Card key={card.target_word} style={styles.card}>
        <Card.Content>
          <Card.Cover
            source={{ uri: card.picture_url ? card.picture_url : 'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png' }}
            style={styles.photo}
            resizeMode="contain"
          />
          <Paragraph style={styles.text}>{card.reading}</Paragraph>
          <Title style={styles.textVocab}>{card.target_word}</Title>
          <Paragraph style={styles.text}> Meaning: {engDef}</Paragraph>
          <Paragraph style={styles.text}>Sentence: {card.example_sentence}</Paragraph>
        </Card.Content>
      </Card>
    );
  };

  const handleDelete = () => {
    // Alert.alert(
    //   'Do you really want to delete your flashcard?',
    //   [
    //     { text: 'Yes', onPress: () => setPressDelete(true) },
    //     { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
    //   ],
    //   { cancelable: true }
    // );
    const [visible, setVisible] = React.useState(false);
    const hideDialog = () => setVisible(false);

    return (
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={styles.title}>Do you really want to delete your flashcard?</Dialog.Title>
          <Dialog.Actions>
            <Button onPress={() => hideDialog()}>Cancel</Button>
            <Button onPress={() => setPressDelete(true)}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }

  return (
    <View style={styles.container}>
      {displayCard(flashcard)}
      {usersFlashcard ?
        <>
          <View>
            <Button icon="login" mode="contained" style={styles.button}
              onPress={handleDelete}>
              <Text>Delete this flashcard</Text>
            </Button>
          </View>
        </>
        : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    textAlign: 'center',
  },
  textVocab: {
    textAlign: 'center',
    fontWeight: "bold"
  },
  card: {
    minWidth: '90%',
    borderRadius: 10,
    margin: 10,
    marginTop: 2,
  },
  photo: {
    minWidth: '80%',
    minHeight: '50%',
    maxHeight: '95%',
    maxWidth: '95%',
    backgroundColor: "transparent"
  },
  button: {
    alignItems: 'center',
    margin: 5,
  },
  title: {
    textAlign: 'center',
  }
})