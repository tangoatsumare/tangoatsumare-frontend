import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import axios from "axios";
import React, { useEffect, useState } from "react";
import {ScrollView, View, StyleSheet} from 'react-native'
import {TextInput, Text, Button, Modal, Portal} from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

import { 
    TangoFlashcard,
    SuperMemoItem,
    SuperMemoGrade,
    SRSTangoFlashcard,
    initializeSRSFlashcard,
    initializeSRSFlashcards,
    validateFlashcard,
    getReviewableSRSFlashcards,
    practiseFlashcard,
    setFlashcardAsGood,
    setFlashcardAsAgain,
    SRSProperties
 } from "../utils/supermemo";

export const SRS = () => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    // not for rendering neccessarily. for prop drilling onto the review screens

    // all the SRS flashcards
    const [ flashcardsAll, setFlashcardsAll ] = useState<SRSTangoFlashcard[]>([]); 
    // a rolling state for reviewable flashcards
    const [ flashcardsReviewable, setFlashcardsReviewable ] = useState<SRSTangoFlashcard[]>([]);

    const isFocused = useIsFocused();
    const [ metrics, setMetrics ] = useState({
        new: 0,
        learning: 0,
        due: 0
    });

    const [ modalVisible, setModalVisible ] = useState(false);

    useEffect(() => {
        if (isFocused) {
            axios
            .get("https://tangoatsumare-api.herokuapp.com/api/flashcards")
            .then((response: any) => {
              const flashcards = response.data.slice(0, 2); // TO CHANGE
              // TO CHANGE
              // Right now, assume the cards for initialize here.
              // But instead, they gotta be initialized beforehand. 
              // because each represents the state of SRS review progress for each card

              // So, it is more appropriate to implement getReviewableSRSFlashcards here
              // once the backend is working
              setFlashcardsAll(initializeSRSFlashcards(flashcards));
            });
        }
    },[isFocused]);

    useEffect(() => {
        dayjs.extend(utc);
        dayjs.extend(tz);
        const now = dayjs();

    }, []);

    useEffect(() => {
        if (flashcardsAll) {
            const newCards = flashcardsAll.filter(card => card.counter === 0).length;
            // learning cards involve the concept of a learning queue.. that involves "steps"
            // const learningCards = flashcardsAll.filter(card => card.counter !== 0 && card.repetition === 0).length;
            const learningCards = 0; // TO CHANGE
            const dueCards = flashcardsReviewable.filter(card => card.counter !== 0).length;
            // flashcardsAll.filter(card => card.counter !== 0 && card.repetition !== 0).length;
            
            setMetrics({
                new: newCards,
                learning: learningCards,
                due: dueCards
            });

            // if flashcards state is updated, adjust the pool of reviewable cards
            // console.log(getReviewableSRSFlashcards(flashcardsAll));
            setFlashcardsReviewable(getReviewableSRSFlashcards(flashcardsAll));
        }
    }, [flashcardsAll]);

    // https://callstack.github.io/react-native-paper/modal.html
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);


    const [ textForGOOD, setTextForGOOD ] = useState(SRSProperties.getGradeForGood().toString());
    const [ textForAGAIN, setTextForAGAIN ] = useState(SRSProperties.getGradeForAgain().toString());
    const [ textForFirstInterval, setTextForFirstInterval ] = useState(SRSProperties.getFirstInterval().toString());
    const [ textForSecondInterval, setTextForSecondInterval ] = useState(SRSProperties.getSecondInterval().toString());

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* <Text>SRS Flashcard feature coming soon</Text> */}
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
            <Button onPress={showModal}>Setting</Button>
            <Text>NEW: {metrics.new}</Text>
            <Text>LEARNING: {metrics.learning} (coming soon)</Text>
            <Text>DUE: {metrics.due}</Text>
            <Text>Reviewable cards (new+learning+due) ({flashcardsReviewable ? flashcardsReviewable.length : 0})</Text>
            {/* <Text>use the due date to determine this</Text> */}
            {flashcardsReviewable? 
                flashcardsReviewable.map(flashcard => {
                    return (
                        <View
                            key={flashcard._id}
                            style={styles.flashcardReviewable}
                        >
                            <Text>Target word: {flashcard.target_word}</Text>
                        </View>
                    );
                })
                : null
            }            

            <Text>All the Cards ({flashcardsAll ? flashcardsAll.length : 0})</Text>
            {flashcardsAll? 
                flashcardsAll.map(flashcard => {
                    return (
                        <View 
                            key={flashcard._id}
                            style={styles.flashcard}
                        >
                            <Text>Target word: {flashcard.target_word}</Text>
                            <Text>Review counter: {flashcard.counter}</Text>
                            <Text>Interval: {flashcard.interval}</Text>
                            <Text>Repetition: {flashcard.repetition}</Text>
                            <Text>E-Factor: {flashcard.efactor.toFixed(2)}</Text>
                            <Text>Due date: {dayjs(flashcard.dueDate).format('YYYY-MM-DDTHH:mm:ss')}</Text>
                            <Button 
                                textColor="green"
                                onPress={() => setFlashcardsAll((prev) => {
                                    const result = [...prev];
                                    for (let i = 0; i < result.length; i++) {
                                        if (result[i]._id === flashcard._id) {
                                            result[i] = setFlashcardAsGood(result[i]);
                                        }
                                    }
                                    return result;
                                })}
                            >good</Button>
                            <Button
                                textColor="red"
                                onPress={() => setFlashcardsAll((prev) => {
                                    const result = [...prev];
                                    for (let i = 0; i < result.length; i++) {
                                        if (result[i]._id === flashcard._id) {
                                            result[i] = setFlashcardAsAgain(result[i]);
                                        }
                                    }
                                    return result;
                                })}
                            >again</Button>
                        </View>
                    )
                }) : null
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
        button: {
            alignItems: 'center',
        },
        container: {
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
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