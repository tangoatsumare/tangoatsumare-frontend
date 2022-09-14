import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import axios from "axios";
import React, { useEffect, useState } from "react";
import {ScrollView, View, Text, StyleSheet} from 'react-native'
import {Button} from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import dayjs from 'dayjs';

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
    setFlashcardAsAgain
 } from "../utils/supermemo";

export const SRS = () => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    // not for rendering neccessarily. for prop drilling onto the review screens
    const [ flashcardsForReview, setFlashcardsForReview ] = useState<SRSTangoFlashcard[]>([]);
    const isFocused = useIsFocused();
    const [ metrics, setMetrics ] = useState({
        new: 0,
        failed: 0,
        review: 0
    });

    useEffect(() => {
        if (isFocused) {
            axios
            .get("https://tangoatsumare-api.herokuapp.com/api/flashcards")
            .then((response: any) => {
              const flashcards = response.data.slice(0, 3); // TO CHANGE
              // TO CHANGE
              // Right now, assume the cards for initialize here.
              // But instead, they gotta be initialized beforehand. 
              // because each represents the state of SRS review progress for each card
              setFlashcardsForReview(initializeSRSFlashcards(flashcards));
            });
        }
    },[isFocused]);

    useEffect(() => {
        if (flashcardsForReview) {
            // console.log(flashcardsForReview);
            // setFlashcardsForReview((prev) => initializeSRSFlashcards(prev));
        }
    }, [flashcardsForReview]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text>How to classify?</Text>
            <Text>new: {metrics.new}</Text>
            <Text>failed: {metrics.failed}</Text>
            <Text>review: {metrics.review}</Text>
            <Text>Show the flashcards here</Text>
            {/* <Text>SRS Flashcard feature coming soon</Text> */}
            {flashcardsForReview? 
                flashcardsForReview.map(flashcard => {
                    return (
                        <View 
                            key={flashcard["_id"]}
                            style={styles.flashcard}
                        >
                            <Text>Target word: {flashcard.target_word}</Text>
                            <Text>Interval: {flashcard.interval}</Text>
                            <Text>Repetition: {flashcard.repetition}</Text>
                            <Text>E-Factor: {flashcard.efactor.toFixed(2)}</Text>
                            <Text>Due date: {dayjs(flashcard.dueDate).format('YYYY-MM-DDTHH:mm:ss')}</Text>
                            <Button 
                                textColor="green"
                                onPress={() => setFlashcardsForReview((prev) => {
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
                                onPress={() => setFlashcardsForReview((prev) => {
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
        }
    }
);