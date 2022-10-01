import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
//import { getFirebaseAuth } from '../firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity,  } from 'react-native'
import { Button } from "react-native-paper";
import {ActivityIndicator} from 'react-native-paper';

// import { useTangoContext } from "../contexts/TangoContext";
import { useAuthContext } from "../contexts/AuthContext";


export const Login = () => {
  const { login, currentUser } = useAuthContext();

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [renderingIndicator, setRenderingIndicator] = useState<boolean>(false);

  const handleLogin = async () => {
    if (email === "" || password === "") {
      setValidationMessage('Please fill in your email and password')
      return;
    }

    try {
      // await signInWithEmailAndPassword(auth, email, password);
      await login(email, password); // NEW
      await setRenderingIndicator(true);
      // await setTimeout(() => {
      //   setRenderingIndicator(false);
      //   navigation.navigate('TabHome');
      // }, 1000);

    } catch(error: any) {
      setValidationMessage(error.message);
    }
  }

  // TESTING
  useEffect(() => {
    if (currentUser) {
      setRenderingIndicator(false);
      navigation.navigate('TabHome');
    }
  }, [currentUser]);

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size='large'
        color="#333"
        animating={renderingIndicator}
      />
      <View style={styles.inputTitle}>
        <Text>Email</Text>
      </View>
      <View style={styles.wrapperInput}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text: string) => setEmail(text)}
        />
      </View>
      <View style={styles.inputTitle}>
        <Text>Password</Text>
      </View>
      <View style={styles.wrapperInput}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text: string) => setPassword(text)}
          secureTextEntry={true}
        />
      </View>
      <View style={styles.btnContainer}>
        <Button mode="contained" style={styles.button}
          onPress={handleLogin}>
          <Text style={{fontSize: 18}}>Login</Text>
        </Button>
        </View>
        <View style={styles.signUp}>
          <Text style={{opacity: 0.5}}>Forgot Password</Text>
          <TouchableOpacity style={styles.button}
            onPress={() => {
              navigation.navigate("Register")
              // navigation.navigate("ProfileSetup")
            }}>
            <Text style={{color: '#FF4F4F'}}>Sign Up</Text>
          </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    // alignItems: 'center',
    // margin: 5,
    padding: 5,
    borderRadius: 25,
    // width: '100%',
  },
  wrapperInput: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'grey',
    // marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    padding: 10,
    width: '90%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  btnContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    width: '90%',
    marginTop: 15,
  },
  inputTitle: {
    width: '89%',
  },
  signUp: {
    width: '80%',
    // backgroundColor: 'blue',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // alignItems: 'stretch'
    
  }
}
);