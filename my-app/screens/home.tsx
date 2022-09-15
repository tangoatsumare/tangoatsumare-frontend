import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { SegmentedButtons, Button } from "react-native-paper";
import { Collection } from "../Components/collection";
import { Feed } from "../Components/feed";

export const Home = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [value, setValue] = React.useState('collection');
  const [userUid, setUserUid] = React.useState<string>('');

  const handleCollection: any = () => {
    if (value === 'collection') {
      return <Collection />
    } else {
      return <Feed />
    }
  }


  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 'collection',
            label: 'Collection',
          },
          {
            value: 'feed',
            label: 'Feed',
          },
        ]}
        style={styles.segment}
      />
      <Collection />
    </View>

  )
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
  container: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segment: {
    marginBottom: 5
  },
}
);