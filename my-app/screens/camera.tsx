import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from '../src/components/Button';
// import { Button } from 'react-native-paper';

export default function CameraTest() {

    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(CameraType.back);
    // const [flash, setFlash] = useState(Camera.Constants.FlashMode.off); //.off no work
    const cameraRef = useRef(null);
    // useEffect(() => {
    //     (async () => {
    //         MediaLibrary.requestPermissionsAsync();
    //         const cameraStatus = await Camera.requestCameraPermissionsAsync();
    //         // not sure if this will work
    //         if (cameraStatus.granted) {
    //             setHasCameraPermission(true);
    //         } else {
    //             alert("Camera Permission Denied!");
    //         }
    //     })();
    // }, []);

    // useEffect(() => {
    //     if (hasCameraPermission) {
    //         // turn on camera
    //         setType((current) => (
    //             current === CameraType.back ? CameraType.front : CameraType.back
    //           )); // from expo docs https://docs.expo.dev/versions/latest/sdk/camera/
    //     }
    // }, [hasCameraPermission]);

    const takePhoto = async () => {
        // MediaLibrary.requestPermissionsAsync();
        // const cameraStatus = await Camera.requestCameraPermissionsAsync();
        // // not sure if this will work
        // if (cameraStatus.granted) {
        //     setHasCameraPermission(true);
        // } else {
        //     alert("Camera Permission Denied!");
        // }
    };

    return (
        <View style={styles.container}>
            {/* <Button>Test</Button> */}
            <Camera
                style={styles.camera}
                type={type}
                // flashMode={flash}
                ref={cameraRef}
            >
                <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={takePhoto}>
                    <Text style={styles.text}>Take Photo</Text>
                </TouchableOpacity>
                </View>

                <Text>Hello</Text>
            </Camera>
            <View>
                
            </View>
        </View>
    )
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
