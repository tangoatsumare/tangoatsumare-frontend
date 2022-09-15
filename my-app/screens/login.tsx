import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
//import { getFirebaseAuth } from '../firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { Button } from "react-native-paper";

export const Login = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const auth = getAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [validationMessage, setValidationMessage] = useState<string>('');

  const handleLogin = async () => {
    if (email === "" || password === "") {
      setValidationMessage('Please fill in your email and password')
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home');
    } catch (error: any) {
      setValidationMessage(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text>Hello user! Welcome back!</Text>
      </View>
      <View style={styles.wrapperInput}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text: string) => setEmail(text)}
        />
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
      <View>
        <Button icon="eye" mode="contained" style={styles.button}
          onPress={handleLogin}>
          <Text>Login</Text>
        </Button>
      </View>
      <View>
        <Button icon="eye" mode="contained" style={styles.button}
          onPress={() => {
            navigation.navigate("Register")
          }}>
          <Text>Register</Text>
        </Button>
      </View>
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