import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ViewComponent } from 'react-native'
import { Button } from "react-native-paper";

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export const Register = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const auth = getAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState<string>('');

  const checkPassword = (firstPassword: string, secoundPassword: string) => {
    if (firstPassword !== secoundPassword) {
      setValidationMessage('Password do not match.')
    }
    else setValidationMessage('')
  }

  const createUserAccount = async () => {
    if (email === '' || password === '') {
      setValidationMessage('Please fill in your email and password.')
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          console.log(result);
          navigation.navigate('Home');
        })
    } catch (error: any) {
      console.log(error);
      if (error.code.include('auth/weak-password')) {
        setValidationMessage('Please enter a strong password.')
      } else if (error.code.include('auth/email-already-in-use')) {
        setValidationMessage('Email already in use.');
      } else {
        setValidationMessage('Unable to register. Please try again later.');
      }
    }
  }


  return (
    <View style={styles.container}>
      <View>
        <Text>Hello user! Wanna learn something new?</Text>
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
      <View style={styles.wrapperInput}>
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={(text: string) => setConfirmPassword(text)}
          secureTextEntry={true}
          onBlur={() => checkPassword(password, confirmPassword)}
        />
      </View>
      <View>
        <Button icon="eye" mode="contained" style={styles.button}
          onPress={createUserAccount}>
          <Text>Register</Text>
        </Button>
      </View>
      <Text>Already have an account?</Text>
      <Button mode="contained" style={styles.button}
        onPress={() => {
          navigation.navigate("Login")
        }}>
        <Text>Login</Text>
      </Button>
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