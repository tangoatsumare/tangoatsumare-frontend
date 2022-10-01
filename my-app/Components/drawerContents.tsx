import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  // Avatar,
  Title,
  Caption,
  Drawer,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";
import { getAuth } from 'firebase/auth';
import axios from 'axios';

import { useAuthContext } from '../contexts/AuthContext';

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

export function DrawerContent(props: any) {
  const { currentUser, logout } = useAuthContext();
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  
  const [userProfileInfo, setUserProfileInfo] = useState<UserInfo[]>();

  useEffect(() => {
    const uid = currentUser;
    axios
      .get(`https://tangoatsumare-api.herokuapp.com/api/usersuid/${uid}`)
      .then((response: any) => {
        const userdata = response.data;
        setUserProfileInfo(userdata);
      });

  }, []);

  const executeLogout = () => {
    logout()
    .then(() => navigation.navigate("Login"))
    .catch(error => console.log(error));
  }

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={
          styles.drawerContent
        }
      >
        <View style={styles.userInfoSection}>
          {/* <Avatar.Image
                        source={{
                            uri:
                                'https://avatars.githubusercontent.com/u/68458897?v=4',
                        }}
                        size={50}
                    /> */}
          {/* <Title style={styles.title}>@{userProfileInfo && userProfileInfo[0].user_name}</Title> */}
          {/* <Caption style={styles.caption}>@DeaNihongo</Caption> */}

        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="account-outline"
                color={color}
                size={size}
              />
            )}
            label="Profile"
            onPress={() => {
              navigation.navigate("Profile")
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="tune" color={color} size={size} />
            )}
            label="Settings"
            onPress={() => {
              navigation.navigate("Settings")
            }}
          />
        </Drawer.Section>
        <Drawer.Section>
          <DrawerItem style={styles.signOut}
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="logout"
                color={color}
                size={size}
              />
            )}
            label="Sign Out"
            onPress={() => executeLogout()}
          />
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  signOut: {
  }
});