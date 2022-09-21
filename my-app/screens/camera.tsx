import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React, { useState } from 'react';
import { StyleSheet, View, Image, ImageBackground } from 'react-native';
import {Text, Button, Divider} from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

export const Camera = () => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

    const [image, setImage] = useState<string>(""); // typescript?
    const [base64, setBase64 ] = useState<string | undefined>("");
 
    const openCamera = async () => {
        const permissionCheck = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionCheck.granted === false) {
            alert("Camera access denied!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            base64: true
        });
        // console.log("result: ", result);

        if (!result.cancelled) {
            setImage(result.uri);
            setBase64(result.base64);
            // console.log("result.uri: ", result.uri);
        }
    }
    

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        });
        // console.log("result: ", result);
        if (!result.cancelled) {
            setImage(result.uri);
            setBase64(result.base64);
        }
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../assets/wallpaper2.png")}
                style={{flex: 1, backgroundColor: "white"}}
                resizeMode="contain"
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 }} resizeMode="contain"/>}
                    {image ? <Button 
                        mode="contained-tonal" 
                        style={styles.button}
                        disabled={image ? false : true}
                        onPress={()=>{
                            if (image) {
                                navigation.navigate("OCR", {
                                    image_uri: image,
                                    image_base64: base64
                                })
                                setImage('');
                            }
                        }}
                    >
                        <Text variant="bodyLarge">continue creation</Text>
                    </Button> :
                    <>
                        <Text variant="headlineMedium">Choose a picture</Text>
                        <Text variant="bodyMedium">and generate a tango flashcard</Text>
                    </>

                    }
                </View>
                <View style={styles.buttonGroup}>
                    <Button onPress={openCamera} labelStyle={styles.functionButton}>
                        <Icon name="camera" size={25} />
                    </Button>
                    <Divider />
                    <Button onPress={pickImage} labelStyle={styles.functionButton}>
                        <Icon name="folder-open" size={25} />
                    </Button>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
        button: {
            margin: 20,
            width: 200,
            borderRadius: 40,
            padding: 5
        },
        container: {
            flex: 1,
            // alignItems: 'center',
            // justifyContent: 'center',
        },
        buttonGroup: {
            justifyContent: 'flex-end',
            alignSelf: 'flex-end',
            marginBottom: 20,
            marginRight: 20,
            borderRadius: 40,
            backgroundColor: 'rgba(0,0,0,0.05)',
            paddingTop: 10,
            paddingBottom: 10,
            shadowColor: 'rgba(0,0,0,0.1)',
            shadowOffset: { width: 3, height: 20 },
            shadowOpacity: 0.8,
            shadowRadius: 15,
        },
        functionButton: {
            padding: 10,
            color: "black"
        },
    }
);
