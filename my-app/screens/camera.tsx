import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerTest() {

    const [image, setImage] = useState<string>(""); // typescript?

    const openCamera = async () => {
        const permissionCheck = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionCheck.granted === false) {
            alert("Camera access denied mutha fuckaaaaaa");
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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />}
            <Button icon="camera" onPress={openCamera}>
                <Text>Open Camera</Text>
            </Button>
            <Button onPress={pickImage}>
                <Text>Select An Image</Text>
            </Button>
            <Text>copy me</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'pink',
        justifyContent: 'center',
        // alignItems: 'center',
    },
    camera: {
        flex: 1,
        borderRadius: 20,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: 100,
        height: 100
    },
    text: {
        // width: 50,
        // height: 50
    }
})
