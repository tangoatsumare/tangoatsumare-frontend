import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Keyboard, Platform } from 'react-native'
import { Button } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const ProfileSetup = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const auth = getAuth();

  // change to full name✅
  // target language (currently learning?) ✅
  // target UI language
  // about me section ✅
  
  // const [firstName, setFirstName] = useState<string>('');
  // const [lastName, setLastName] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');

  const [username, setUsername] = useState<string>('');
  const [profilePic, setProfilePic] = useState<string>('');
  const [base64, setBase64] = useState<string>('');
  const [homeCountry, setHomeCountry] = useState<string>('');
  const [currentlyLearning, setCurrentlyLearning] = useState<string>('');
  const [aboutMe, setAboutMe] = useState<string>('');
  const [validationMessage, setValidationMessage] = useState<string>('');

  const usernameAvailibility = () => {
    // check db for username availability
    // if available, green check mark next to input box
    // else, red x mark next to input box 
  }

  const submitProfileInfo = () => {
    // submits all user info into db
    console.log("submit pushed");
    const test = {
      profilePic,
      fullName,
      username,
      homeCountry,
      currentlyLearning,
      aboutMe
    }
    console.log("test usestate info: ", test)
  }

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

//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [validationMessage, setValidationMessage] = useState<string>('');

//   const handleLogin = async () => {
//     if (email === "" || password === "") {
//       setValidationMessage('Please fill in your email and password')
//       return;
//     }

//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigation.navigate('Home');
//     } catch(error: any) {
//       setValidationMessage(error.message);
//     }
//   }

  // touchablewithoutfeedback disables buttons and makes them not pressable...

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container} keyboardVerticalOffset={5}>
      <KeyboardAwareScrollView>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        <View>
          <View style={{alignItems: 'center', justifyContent: 'center' }}>
            {profilePic && <Image source={{ uri: profilePic }} style={ styles.avatar } resizeMode="contain"/>}
              <Button onPress={selectProfilePic} style={{marginBottom: 25}}>
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
          <View style={{alignItems: 'center', justifyContent: 'center' }}>
              <Button mode="contained" onPress={submitProfileInfo} style={{marginTop: 25}}>
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