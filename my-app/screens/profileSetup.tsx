import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
//testing
import app from '../firebase';
import { 
  getStorage,
  ref, 
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
//testing

import React, { useState, useEffect } from "react";
import uuid from 'react-native-uuid';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Keyboard, Platform } from 'react-native'
import { Button } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

//test
import { getProfileInfoById } from "../utils/profileInfo";
import axios from 'axios';
//test
interface UserInfo {
  uuid: string,
  real_name: string,
  user_name: string,
  avatar_url: string,
  about_me: string,
  nationality: string,
  target_language: string,
  cards: {
    user_cards: string[],
    user_favorite: string[],
  },
  save_new_card_to_deck: boolean,
  ui_language: string,
  dark_mode: boolean
}

export const ProfileSetup = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const auth = getAuth();
  //testing
  const storage = getStorage(app);
  //testing

  // change to full name✅
  // target language (currently learning?) ✅
  // target UI language
  // about me section ✅

  // UPDATED
  // only username, currently learning, and about me

  // const [firstName, setFirstName] = useState<string>('');
  // const [lastName, setLastName] = useState<string>('');
  // const [fullName, setFullName] = useState<string>('');

  const [username, setUsername] = useState<string>('');
  const [isAvailable, isSetAvailable] = useState<string>('');
  const [profilePic, setProfilePic] = useState<string>('');
  const [base64, setBase64] = useState<string>('');
  // const [homeCountry, setHomeCountry] = useState<string>('');
  const [getUserinfo, setGetUserinfo] = useState<UserInfo[]>();
  const [currentlyLearning, setCurrentlyLearning] = useState<string>('');
  const [aboutMe, setAboutMe] = useState<string>('');
  const [validationMessage, setValidationMessage] = useState<string>('');
  // const [userProfileInfo, setUserProfileInfo] = useState<string>('');
  const [userUid, setUserUid] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [ cloudStoragePath, setCloudStoragePath ] = useState<string>('');

  useEffect(() => {
    handleUID();
    // getProfileInfoById(userUid)
  }, []);

  //testing

  async function uploadImageAsync(uri: string): Promise<string> {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662

    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  
    // ********** CHANGE FLASHCARDS FOLDER TO PROFILEPIC FOLDER (MAKE IN FIREBASE CONSOLE) *****************
    const fileRef = ref(storage, `profilepic/${userId}/${uuid.v4()}`); // uuid for the photo object's name
    const result = await uploadBytesResumable(fileRef, blob);
  
    // We're done with the blob, close and release it
    // blob.close();
  
    return await getDownloadURL(fileRef);
  }

  const uploadToFirebaseCloudStorage = async (): Promise<void> => {
    if (profilePic) {
        try {
            const uploadURL = await uploadImageAsync(profilePic);
            setCloudStoragePath(uploadURL);
        } catch (err) {
            console.log(err);
        }
    }
};

  //testing

  useEffect(() => {
    (async () => {
      try {
        await fetch(`https://tangoatsumare-api.herokuapp.com/api/users`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(async response => {
          // console.log(response);
          const result = await response.json();
          // console.log(result);
          setGetUserinfo(result);
        })
      } catch(err) {
        console.log(err);
      }
    })()
  }, []); // was [submitted]

  // change effect to if profilePic exists ?
  useEffect(() => {
    (async () => { 
        if (isSubmitted) { // if userinfo submission button is clicked, execute photo upload
            await uploadToFirebaseCloudStorage();
        }
    })();
  }, [isSubmitted])

  useEffect(() => {
    (async () => {
      if (cloudStoragePath) {
        const userinfo: UserInfo = {
          uuid: userUid,
          real_name: '',
          user_name: username,
          avatar_url: cloudStoragePath, //formerly profilePic
          about_me: aboutMe,
          nationality: '',
          target_language: currentlyLearning,
          cards: {
            user_cards: [],
            user_favorite: [],
          },
          save_new_card_to_deck: true,
          ui_language: 'en',
          dark_mode: false
        }
        try {
          await fetch(`https://tangoatsumare-api.herokuapp.com/api/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userinfo)
          });
          console.log("Userinfo POSTed to heroku backend");
        } catch (err) {
          console.log(err);
        }
      }
    })();
  }, [cloudStoragePath])

  const tempDbObj = [
    {
      UUID: 1,
      username: "King Butt",
    },
    {
      UUID: 2,
      username: "Monkey-Man",
    }
  ];

  const handleUID = () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid
    setUserUid(userId || '') // typescript??
  }

  // async
  const usernameAvailibility = () => {
    // check db for username availability
    // if available, green check mark next to input box
    // else, red x mark next to input box 
    let isAvailable = true;

    // replace tempDbObj with all usernames from database when available
    for (const user of tempDbObj) {
      if (user.username.toLowerCase() === username.toLowerCase()) {
        isAvailable = false;
      }
    }

    return isAvailable;
  }

  function submitProfileInfo() {
    // submits all user info into db

    if (username === '') {
      alert("Please insert a username");
      return;
    }

    if (usernameAvailibility() === true) {
      console.log("username available and submitted")
    } else {
      alert("Username unavailable");
      console.log("username unavailable and not submitted");
      return;
    }

    // post user information to heroku db VV

    // post user information to heroku db ^^
    navigation.navigate("TabHome");
  }

  // need to get profilepic info from firebase and put into avatar_url... i think?
  // const handleSendInfoToDb = () => {
  //   (async () => {
  //     const userinfo: UserInfo = {
  //       uuid: userUid,
  //       real_name: '',
  //       user_name: username,
  //       avatar_url: cloudStoragePath, //formerly profilePic
  //       about_me: aboutMe,
  //       nationality: '',
  //       target_language: currentlyLearning,
  //       cards: {
  //         user_cards: [],
  //         user_favorite: [],
  //       },
  //       save_new_card_to_deck: true,
  //       ui_language: 'en',
  //     }
  //     try {
  //       await fetch(`https://tangoatsumare-api.herokuapp.com/api/users`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(userinfo)
  //       });
  //       console.log("Userinfo POSTed to heroku backend");
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   })();
  // }

  const selectProfilePic = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    });
    if (!result.cancelled) {
      setProfilePic(result.uri);
      // setBase64(result.base64); // typescript?
    }
  }


  // touchablewithoutfeedback disables buttons and makes them not pressable...

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container} keyboardVerticalOffset={5}>
      <KeyboardAwareScrollView>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        <View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {profilePic && <Image source={{ uri: profilePic }} style={styles.avatar} resizeMode="contain" />}
            <Button onPress={selectProfilePic} style={{ marginBottom: 25 }}>
              <Text>Select An Image</Text>
            </Button>
          </View>
          {/* <View style={styles.wrapperInput}>
            <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={(text: string) => setFullName(text)} 
            />
          </View> */}
          {/* <View style={styles.wrapperInput}>
            <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={(text: string) => setLastName(text)} 
            />
          </View> */}
          <View style={styles.wrapperInput}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={(text: string) => setUsername(text)}
            />
          </View>
          <Text>
            {isAvailable}
          </Text>
          {/* <View style={styles.wrapperInput}>
            <TextInput
            style={styles.input}
            placeholder="Preferred Languages"
            value={homeCountry}
            onChangeText={(text: string) => setHomeCountry(text)} 
            />
          </View> */}
          <View style={styles.wrapperInput}>
            <TextInput
              style={styles.input}
              placeholder="Currently learning"
              value={currentlyLearning}
              onChangeText={(text: string) => setCurrentlyLearning(text)}
            />
          </View>
          <View style={styles.wrapperInput}>
            <TextInput
              style={styles.input}
              placeholder="About Me"
              value={aboutMe}
              onChangeText={(text: string) => setAboutMe(text)}
            />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Button mode="contained" style={{ marginTop: 25 }}
              onPress={() => {
                submitProfileInfo();
                setIsSubmitted(true);
                // handleSendInfoToDb();
                // navigation.navigate("Home");
              }}
            >
              <Text>Submit</Text>
            </Button>
          </View>
        </View>
        {/* </TouchableWithoutFeedback> */}
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
  wrapperInput: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'grey',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    padding: 10,
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 60,
    padding: 10
    // height: 'auto'
    // justifyContent: 'center',
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 150,
    borderWidth: 0.25,
    marginBottom: 20
  }
}
);