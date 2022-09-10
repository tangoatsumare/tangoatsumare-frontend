import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React, { useEffect, useState } from 'react'
import { Button, TextInput} from "react-native-paper";
import { StyleSheet,  View, KeyboardAvoidingView, Text, ImageBackground } from 'react-native'



export const Login = () => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");



    
      return (
     
        <View 
        style={styles.container}

        >
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={text => setEmail(text)}
             
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={text => setPassword(text)}
              secureTextEntry
            />    
    
            <Button
             onPress={()=>{
                navigation.navigate("Home")
            }}>
              <Text>Login</Text>
            </Button>
            <Button
             onPress={()=>{
                navigation.navigate("Home")
            }}>
              <Text>Register</Text>
            </Button>
        </View>
      )
    }
        
    const styles = StyleSheet.create({
        container: {
            marginTop: '75%',
        }
    })

