import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { Button } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';

export const profileSetup = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const auth = getAuth();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [profilePic, setProfilePic] = useState<string>('');
  const [base64, setBase64] = useState<string>('');
  const [homeCountry, setHomeCountry] = useState<string>('');
  const [currentlyLearning, setCurrentlyLearning] = useState<string>('');
  const [validationMessage, setValidationMessage] = useState<string>('');

  const usernameAvailibility = () => {
    // check db for username availability
    // if available, green check mark next to input box
    // else, red x mark next to input box 
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
        setBase64(result.base64); // typescript?
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

  return (
    <View style={styles.container}>

    </View>
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
    justifyContent: 'center',
  }
}
);