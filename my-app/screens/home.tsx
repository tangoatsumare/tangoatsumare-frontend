import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React from "react";
import {View, TouchableOpacity, Text} from 'react-native'
import {IStackScreenProps} from "../library/stackScreenProps";

export const Home = () => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

    return (
        <View>
            <TouchableOpacity
                onPress={()=>{
                    navigation.navigate("Card")
                }}>
                <Text>to card</Text>
            </TouchableOpacity>

        </View>
    )
}

