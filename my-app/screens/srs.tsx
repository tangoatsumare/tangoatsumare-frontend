import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import React, { useEffect, useState } from "react";
import {ScrollView, View, StyleSheet} from 'react-native'
import {TextInput, Text, Button, Modal, Portal} from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { useTheme } from 'react-native-paper';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { 
    SRSTangoFlashcard,
    getReviewableSRSFlashcards,
    SRSProperties
 } from "../utils/supermemo";
import { HTTPRequest, UserId } from "../utils/httpRequest";

export const SRS = ({route}) => {
    const auth = getAuth();
    const userId: UserId = auth.currentUser?.uid;
    const theme = useTheme();
    const isFocused = useIsFocused();
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    
    const [ flashcardsReviewable, setFlashcardsReviewable ] = useState<SRSTangoFlashcard[]>([]);
    const [ metrics, setMetrics ] = useState({
        new: 0,
        // learning: 0,
        due: 0
    });
    const [ modalVisible, setModalVisible ] = useState(false);

    useEffect(() => {
        (async () => {
            if (isFocused && userId) {
                const flashcards: SRSTangoFlashcard[] = await HTTPRequest.getSRSFlashcardsByUser(userId);
                setFlashcardsReviewable(getReviewableSRSFlashcards(flashcards));
            } 
        })();
    },[isFocused]);

    useEffect(() => {
        if (flashcardsReviewable) {
            const newCards = flashcardsReviewable.filter(card => card.counter === 0).length;
            // learning cards involve the concept of a learning queue.. that involves "steps"
            // const learningCards = flashcardsAll.filter(card => card.counter !== 0 && card.repetition === 0).length;
            // const learningCards = 0; // TO CHANGE
            const dueCards = flashcardsReviewable.filter(card => card.counter !== 0).length;
            
            setMetrics({
                new: newCards,
                // learning: learningCards,
                due: dueCards
            });

        }
    }, [flashcardsReviewable]);

    // https://callstack.github.io/react-native-paper/modal.html
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    const [ textForGOOD, setTextForGOOD ] = useState(SRSProperties.getGradeForGood().toString());
    const [ textForAGAIN, setTextForAGAIN ] = useState(SRSProperties.getGradeForAgain().toString());
    const [ textForFirstInterval, setTextForFirstInterval ] = useState(SRSProperties.getFirstInterval().toString());
    const [ textForSecondInterval, setTextForSecondInterval ] = useState(SRSProperties.getSecondInterval().toString());

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Portal>
                <Modal
                    visible={modalVisible}
                    onDismiss={hideModal}
                    contentContainerStyle={styles.modal}
                >
                    <Text variant="headlineMedium">Settings</Text>   
                    <Text variant="titleMedium">SRS</Text>
                    <Text variant="bodyMedium">Intervals (days)</Text>
                    <Text variant="labelSmall">set the intervals for next review occurence</Text>
                    <TextInput 
                        label="1st interval"
                        value={textForFirstInterval}
                        onChangeText={text => setTextForFirstInterval(text)}
                    />
                    <TextInput 
                        label="2nd interval"
                        value={textForSecondInterval}
                        onChangeText={text => setTextForSecondInterval(text)}
                    />

                    <Text variant="bodyMedium">Grade (0-5)</Text>
                    <Text variant="labelSmall">set the supermemo grade for good/again</Text>
                    <TextInput 
                        label="good"
                        value={textForGOOD}
                        onChangeText={text => setTextForGOOD(text)}
                    />
                    <TextInput 
                        label="again"
                        value={textForAGAIN}
                        onChangeText={text => setTextForAGAIN(text)}
                    />
                    <Button onPress={() => {
                        SRSProperties.setGradeForGood(Number(textForGOOD));
                        SRSProperties.setGradeForAgain(Number(textForAGAIN));
                        SRSProperties.setFirstInterval(Number(textForFirstInterval));
                        SRSProperties.setSecondInterval(Number(textForSecondInterval));
                        hideModal();
                    }}>Update</Button>
                </Modal>
            </Portal>

            <View style={styles.container}>
                <View style={styles.metrics}>
                    <Text>New: {metrics.new} </Text>
                    <Text>Due: {metrics.due} </Text>
                </View>
                <Button 
                    mode="contained" 
                    style={styles.button}
                    buttonColor={theme.colors.secondary}
                    disabled={flashcardsReviewable.length === 0 ? true: false}
                    onPress={()=>{
                        navigation.navigate("Review", {
                            flashcardsAll: flashcardsReviewable
                        });
                    }}>
                    <Text>Study</Text>
                </Button>
                <Button onPress={showModal}>Setting</Button>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
        button: {
            alignItems: 'center',
            margin: 20
        },
        container: {
            padding: 10,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        metrics: {
            alignItems: 'flex-start'
        },
        flashcard: {
            margin: 10,
            backgroundColor: 'lightgrey',
            padding: 20
        },
        flashcardReviewable: {
            margin: 10,
            backgroundColor: 'skyblue',
            padding: 20
        },
        modal: {
            backgroundColor: 'white',
            padding: 20,
            margin: 20
        }
    }
);