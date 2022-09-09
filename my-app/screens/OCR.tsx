import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import imageSource from '../assets/ocr-test.jpeg';
import cat from '../assets/wakeupcat.jpeg';
// import SelectableText from 'react-native-selectable-text';
// Imports the Google Cloud client library
// import vision from '@google-cloud/vision';
import { useState, useEffect } from 'react';
import { sendImageToCloudVisionApi } from '../utils/flashcard';

export const OCR = () => {
    const publiclyAccessibleImage = 'https://amerikaya-arc.com/blog/wp-content/uploads/2021/03/4520693_s.jpg';
    const [ image, setImage ] = useState(publiclyAccessibleImage);
    const [ responseText, setResponseText ] = useState('hey yoooo');
    const [ selectedText, setSelectedText ] = useState('');

    useEffect(() => {
        (async () => {
            // try {
            //     const data = {
            //         target_word: 'Testing',
            //         context: 'Testing',
            //         reading: 'Testing',
            //         english_definition: [],
            //         image: 'Testing',
            //         parts_of_speech: 'Testing',
            //     };

            //     const response = await fetch('https://tangoatsumare-api.herokuapp.com/api/flashcards', {
            //         method: 'POST',
            //         headers: {
            //             "Content-Type": "application/json"
            //         },
            //         body: JSON.stringify(data)
            //     });
            //     const responseJson = await response.json();
            //     console.log(responseJson);
            // } catch (err) {
            //     console.log(err);
            // }
        })();
    }, []);
    
    const handleButtonClick = async () => {
        try {
            const result = 
            await sendImageToCloudVisionApi(image);
            // console.log(result);
            setResponseText(result);
        } catch (err) {
            console.log(err);
        }
        
    };

    const onPressTitle = () => {
        setSelectedText("[pressed]");
    }

    const doSomething = (e) => {
        const start = e.nativeEvent.selection.start;
        const end = e.nativeEvent.selection.end;
        // console.log(start, end);
        const selectedChunk = responseText.substring(start, end);
        console.log(selectedChunk);
        setSelectedText(selectedChunk);
    }

    const receiveDictionaryInfo = () => {
        
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: publiclyAccessibleImage }} style={styles.logo} />
            <Button 
                icon="eye" 
                mode="contained"
                onPress={handleButtonClick}
                style={styles.button}
            >
                Send to Cloud Vision
            </Button>
            <View 
                style={styles.responseContainer}
            >
                <Text>This is the response: </Text>
                <TextInput
                    style={styles.responseText}
                    onSelectionChange={doSomething}
                    editable={false}
                    multiline={true}
                >
                    {responseText}
                </TextInput>
            </View>
            <View style={styles.userTextSelection}>
                <Text>Here is for user text selection:</Text>
                <Text style={styles.responseText}>{selectedText}</Text>
            </View>
            <View style={styles.testing}>
            <Button 
                mode="contained"
                style={styles.button}
                onPress={receiveDictionaryInfo}
            >
                Send
            </Button>
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
        margin: 20,
    },
    responseContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    userTextSelection: {
        padding: 20,
        fontSize: 50,
    },
    responseText: {
        fontSize: 50,
        padding: 20
    },
    testing: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
  });
  