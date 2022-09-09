import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React from "react";
import {View, Text, StyleSheet} from 'react-native'
import {Button} from "react-native-paper";

export const Feed = () => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

    return (
        <View style={styles.container}>
            <Button icon="eye" mode="contained" style={styles.button}
                        onPress={()=>{
                            navigation.navigate("Settings")
                        }}>
                    <Text>Feed</Text>
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
            alignItems: 'center',
            justifyContent: 'center',
        }
    }
);