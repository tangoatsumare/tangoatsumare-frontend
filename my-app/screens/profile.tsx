import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import { Button, Avatar, Title, Divider, Checkbox} from "react-native-paper";
import axios from 'axios';
import { getAuth } from 'firebase/auth';

interface UserInfo {
  __v: number,
  _id: string
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
}

export const Profile = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const [userProfileInfo, setUserProfileInfo] = useState<UserInfo[]>();
  const [checked, setChecked] = useState<boolean>(false);


  useEffect(() => {
    const auth = getAuth();
    const uid = auth.currentUser?.uid;
    
    axios
      .get(`https://tangoatsumare-api.herokuapp.com/api/usersuid/${uid}`)
      .then((response: any) => {
        const userdata = response.data;
        setUserProfileInfo(userdata);
      });

  }, []);

  return (
    <View style={styles.container}>

      <Avatar.Image size={225} source={userProfileInfo && userProfileInfo[0].avatar_url ? {uri: userProfileInfo[0].avatar_url} : require("../assets/noImageUploaded.png")}/>
      <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 35, paddingTop: 10}}>{userProfileInfo && userProfileInfo[0].user_name}</Text>

      <View style={styles.infoContainer}>

        <Title style={{fontSize: 18, fontWeight: 'bold'}}>About me</Title>
        <Text style={{minHeight: 105}}>
          {userProfileInfo && userProfileInfo[0].about_me}
        </Text>
        <Divider style={{
          width: '100%',
          borderBottomWidth: 1,
          borderColor: 'black'
        }}/>

        <View style={styles.checkBox}>
          <Text> New cards public </Text>  
          <Checkbox status={checked ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(!checked);
            console.log("checkbox pressed: ", checked);
          }}
          />
        </View>

      </View>

    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: 'white'
  },
  infoContainer: {
    alignItems: 'flex-start',
    width: '75%'
  },
  checkBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
}
);