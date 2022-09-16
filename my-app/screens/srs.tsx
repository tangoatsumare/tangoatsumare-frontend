import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React from "react";
import {View, StyleSheet} from 'react-native'
import {Button, Text } from "react-native-paper";

let newCards = 10;
let failed = 1;
let review = 69;

export const SRS = () => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

    return (
        <View style={styles.container}>
            
                <Text>New Cards: {newCards} </Text>
                <Text>Reviewing: {failed} </Text>
                <Text>Due Today: {review} </Text>
                <Button mode="contained" style={styles.button}
                    onPress={()=>{
                        navigation.navigate("Front")
                    }}>
                <Text>Study</Text>
            </Button>

        </View>
    )
}

const styles = StyleSheet.create({
        button: {
            alignItems: 'center',
        },
        container: {
            flex: 1,
            justifyContent: 'center'
        }
    }
);