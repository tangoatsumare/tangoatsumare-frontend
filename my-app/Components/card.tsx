import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React from "react";
import {View, Text} from 'react-native'
import {Button} from "react-native-paper";

export const Card = () => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

    return (
        <View>
            <Button icon="eye" mode="contained"
                    onPress={()=>{
                        navigation.navigate("Settings")
                    }}>
                <Text>To Settings</Text>
            </Button>
        </View>
    )
}