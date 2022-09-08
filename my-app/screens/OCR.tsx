import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import imageSource from '../assets/ocr-test.jpeg';
import cat from '../assets/wakeupcat.jpeg';
// Imports the Google Cloud client library
// import vision from '@google-cloud/vision';
import { useState, useEffect } from 'react';
import { sendImageToCloudVisionApi } from '../utils/flashcard';

export const OCR = () => {
    const publiclyAccessibleImage = 'https://amerikaya-arc.com/blog/wp-content/uploads/2021/03/4520693_s.jpg';
    const [ image, setImage ] = useState(publiclyAccessibleImage);
    const [ responseText, setResponseText ] = useState('');

    useEffect(() => {
    }, []);
    
    const handleButtonClick = async () => {
        try {
            const result = await sendImageToCloudVisionApi(image);
            console.log(result);
            setResponseText(result);
        } catch (err) {
            console.log(err);
        }
        
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: publiclyAccessibleImage }} style={styles.logo} />
            <TouchableOpacity 
                onPress={handleButtonClick}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Send to Cloud Vision</Text>
            </TouchableOpacity>
            <View style={styles.responseContainer}>
                <Text>This is the response: </Text>
                <Text>{responseText}</Text>
            </View>
            <View style={styles.userTextSelection}>
                <Text>Here is for user text selection:</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
        width: 305,
        height: 159
    },
    button: {
        backgroundColor: "blue",
        padding: 20,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    },
    responseContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    userTextSelection: {
        padding: 20
    }
  });
  