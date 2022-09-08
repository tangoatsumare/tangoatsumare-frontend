import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, Platform } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
// import * as MediaLibrary from 'expo-media-library';
// import Button from '../src/components/Button';
// import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerTest() {

    const [image, setImage] = useState<string>(""); // typescript?
    const [status, setStatus] = ImagePicker.useCameraPermissions();

    // const permissionCheck = async () => {
    //     await ImagePicker.getCameraPermissionsAsync();
    // }

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
            <Button title="Camera" onPress={openCamera} />
            <Button title="Select image" onPress={pickImage} />
        </View>
    );
}



// export default function CameraTest() {

//     const [hasCameraPermission, setHasCameraPermission] = useState(false);
//     const [image, setImage] = useState(null);
//     const [type, setType] = useState(CameraType.back);
//     // const [flash, setFlash] = useState(Camera.Constants.FlashMode.off); //.off no work
//     const cameraRef = useRef(null);
//     // useEffect(() => {
//     //     (async () => {
//     //         MediaLibrary.requestPermissionsAsync();
//     //         const cameraStatus = await Camera.requestCameraPermissionsAsync();
//     //         // not sure if this will work
//     //         if (cameraStatus.granted) {
//     //             setHasCameraPermission(true);
//     //         } else {
//     //             alert("Camera Permission Denied!");
//     //         }
//     //     })();
//     // }, []);

//     const takePhoto = async () => {
//         // MediaLibrary.requestPermissionsAsync();
//         // const cameraStatus = await Camera.requestCameraPermissionsAsync();
//         // // not sure if this will work
//         // if (cameraStatus.granted) {
//         //     setHasCameraPermission(true);
//         // } else {
//         //     alert("Camera Permission Denied!");
//         // }
//     };

//     return (
//         <View style={styles.container}>
//             {/* <Button>Test</Button> */}
//             <Camera
//                 style={styles.camera}
//                 type={type}
//                 // flashMode={flash}
//                 ref={cameraRef}
//             >
//                 <View style={styles.buttonContainer}>
//                 <TouchableOpacity
//                     style={styles.button}
//                     onPress={takePhoto}>
//                     <Text style={styles.text}>Take Photo</Text>
//                 </TouchableOpacity>
//                 </View>

//                 <Text>Hello</Text>
//             </Camera>
//             <View>
                
//             </View>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'pink',
//         justifyContent: 'center',
//         // alignItems: 'center',
//     },
//     camera: {
//         flex: 1,
//         borderRadius: 20,
//     },
//     buttonContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     button: {
//         width: 100,
//         height: 100
//     },
//     text: {
//         // width: 50,
//         // height: 50
//     }
// })
