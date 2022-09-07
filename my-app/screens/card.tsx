import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React from "react";
import {View, TouchableOpacity, Text} from 'react-native'

export const Card = () => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();


    return (
        <View>
            <TouchableOpacity
                onPress={() => {
                    navigation.replace("Home")
                }}>
                <Text>to card</Text>
            </TouchableOpacity>

        </View>
    )
}