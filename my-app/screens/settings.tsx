import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React from "react";
import {View, Text, StyleSheet} from 'react-native'
import {Button} from "react-native-paper";

export const Settings = () => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

    return (
        <View style={styles.container}>
      
                <Text>Settings screen coming soon</Text>
         
        </View>
    )
}

const styles = StyleSheet.create({
        button: {
            alignItems: 'center',
        },
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }
    }
);