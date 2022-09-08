import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import {Button} from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';

export const Camera = () => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

    const [image, setImage] = useState<string>(""); // typescript?

    const openCamera = async () => {
        const permissionCheck = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionCheck.granted === false) {
            alert("Camera access denied!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();
        console.log("result: ", result);

        if (!result.cancelled) {
            setImage(result.uri);
            console.log("result.uri: ", result.uri);
        }
    }
    

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        console.log("result: ", result);
        if (!result.cancelled) {
            setImage(result.uri);
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />}
                <Button icon="camera" onPress={openCamera}>
                    <Text>Open Camera</Text>
                </Button>
                <Button onPress={pickImage}>
                    <Text>Select An Image</Text>
                </Button>
            </View>
            <Button icon="eye" mode="contained" style={styles.button}
                    onPress={()=>{
                        navigation.navigate("Home")
                    }}>
                <Text>Return Home</Text>
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
