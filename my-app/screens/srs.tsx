import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import React, { useEffect, useState } from "react";
import {ScrollView, View, StyleSheet, FlatList} from 'react-native'
import {TextInput, Text, Button, Modal, Portal, Card, Title, Paragraph} from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { useTheme } from 'react-native-paper';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
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
    
    const [ flashcardsAll, setFlashcardsAll ] = useState<SRSTangoFlashcard[]>([]);
    const [ flashcardsReviewable, setFlashcardsReviewable ] = useState<SRSTangoFlashcard[]>([]);
    const [ metrics, setMetrics ] = useState({
        new: 0,
        // learning: 0,
        due: 0
    });
    const [ modalContent, setModalContent ] = useState('');
    const [ modalVisible, setModalVisible ] = useState(false);

    useEffect(() => {
        (async () => {
            if (isFocused && userId) {
                const flashcards: SRSTangoFlashcard[] = await HTTPRequest.getSRSFlashcardsByUser(userId);
                setFlashcardsAll(flashcards);
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

    useEffect(() => {
        if (modalContent) {
            showModal();
        }
    }, [modalContent]);

    const SettingModalContent = () => {
        return (
            <>
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
            </>
        );
    }

    const SRSFlashcardsModalContent = () => {
        return (
            <FlatList
            //   showsVerticalScrollIndicator={false}
              contentContainerStyle={{}}
              // ItemSeparatorComponent={() => <View style={styles.separator} />}
              data={flashcardsAll}
              keyExtractor={(item) => item._id}
              renderItem={({item}) => {
                return (
                    <Card>
                        <Card.Content
                            style={styles.cardContent}
                        >
                            <Card.Cover 
                                source={{uri: item.Flashcard[0].picture_url ? item.Flashcard[0].picture_url : 'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png'}} 
                                style={styles.cardCover}
                                resizeMode="contain"
                            />
                            <View style={styles.cardMain}>
                                <Title style={styles.textVocab}>{item.Flashcard[0].target_word}</Title>
                                <Paragraph style={styles.text}>Sentence: {item.Flashcard[0].example_sentence}</Paragraph>
                                {/* <Paragraph>Counter: {item.counter}</Paragraph> */}
                                {/* <Paragraph>Interval: {item.interval}</Paragraph> */}
                                {/* <Paragraph>Repetition: {item.repetition}</Paragraph> */}
                                {/* <Paragraph>Efactor: {item.efactor}</Paragraph> */}
                                <Paragraph>next review: {dayjs(item.due_date).fromNow()}</Paragraph>
                            </View>
                        </Card.Content>
                        <Card.Actions>
                        </Card.Actions>
                    </Card>
                  );
              }
          }
        />
        );
    }

    useEffect(() => {
        if (flashcardsAll) {
            console.log(flashcardsAll);
        }
    }, [flashcardsAll]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Portal>
                <Modal
                    visible={modalVisible}
                    onDismiss={hideModal}
                    contentContainerStyle={styles.modal}
                >
                    {modalContent === 'setting' ? 
                        <SettingModalContent /> :
                        modalContent === 'srsFlashcards' ?
                        <SRSFlashcardsModalContent /> :
                        null}
                </Modal>
            </Portal>

            <View style={styles.container}>
                <View style={styles.metrics}>
                    <Text style={styles.metricText}>New: {metrics.new} </Text>
                    <Text style={styles.metricText}>Due: {metrics.due} </Text>
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
                <Button 
                    onPress={() => {
                        if (modalContent === 'srsFlashcards') showModal();
                        else setModalContent('srsFlashcards');
                    }}
                >Show my SRS flashcards</Button>
                <Button 
                    onPress={() => {
                        if (modalContent === 'setting') showModal();
                        else setModalContent('setting');
                    }}
                >Setting</Button>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
        cardContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        cardCover: {
            flex: 1,
            height: 100,
            backgroundColor: 'transparent'
        },
        cardMain: {
            width: 200
        },
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
        },
        metricText: {
            fontSize: 30
        }
    }
);