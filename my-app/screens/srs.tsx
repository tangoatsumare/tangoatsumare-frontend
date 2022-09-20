import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import React, { useEffect, useState, useLayoutEffect } from "react";
import {ScrollView, View, StyleSheet, FlatList} from 'react-native'
import {TextInput, Text, Button, Modal, Portal, Card, Title, Paragraph, SegmentedButtons} from "react-native-paper";
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
    const [ modalSegmentButtonValue, setModalSegmentButtonValue ] = useState('all'); // all & due

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

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                    return (
                        <Button 
                            icon="cog-outline" 
                            onPress={() => {
                                if (modalContent === 'setting') showModal();
                                else setModalContent('setting');
                            }}
                            labelStyle={{
                                color: 'black',
                                fontSize: 20
                            }}
                            
                        >
                        </Button>
                    );
            }
        })
    })

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
            <>
                <SegmentedButtons 
                    value={modalSegmentButtonValue}
                    onValueChange={setModalSegmentButtonValue}
                    buttons={[
                    {
                        value: 'all',
                        label: 'All',
                        icon: 'newspaper-variant-multiple-outline',
                        style: styles.segmentButton
                    },
                    {
                        value: 'due',
                        label: 'Due',
                        icon: 'newspaper-variant-outline',
                        style: styles.segmentButton
                    },
                    ]}
                />
                <FlatList
                    contentContainerStyle={{}}
                    data={modalSegmentButtonValue === 'all' ? 
                            flashcardsAll :
                        modalSegmentButtonValue === 'due' ? 
                            flashcardsReviewable : null}
                    keyExtractor={(item) => item._id}
                    renderItem={({item}) => {
                        return (
                            <Card style={styles.card} mode="contained" theme={theme}>
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
                                        <Paragraph style={styles.text}>{item.Flashcard[0].example_sentence}</Paragraph>
                                        {/* <Paragraph>Counter: {item.counter}</Paragraph> */}
                                        {/* <Paragraph>Interval: {item.interval}</Paragraph> */}
                                        {/* <Paragraph>Repetition: {item.repetition}</Paragraph> */}
                                        {/* <Paragraph>Efactor: {item.efactor}</Paragraph> */}
                                        <Paragraph>{item.counter} attempt{item.counter === 0 ? '': 's'}</Paragraph>
                                        <Paragraph>due {dayjs(item.due_date).fromNow()}</Paragraph>
                                    </View>
                                </Card.Content>
                                <Card.Actions>
                                </Card.Actions>
                            </Card>
                        );
                    }}
                />
            </>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Portal>
                <Modal
                    visible={modalVisible}
                    onDismiss={hideModal}
                    contentContainerStyle={styles.modal}
                >
                    <Button icon="close" onPress={hideModal}>close</Button>
                    {modalContent === 'setting' ? 
                        <SettingModalContent /> :
                        modalContent === 'srsFlashcards' ?
                        <SRSFlashcardsModalContent /> :
                        null}
                </Modal>
            </Portal>

            <View style={styles.container}>
                <View style={styles.main}>
                    <Text variant="headlineMedium">Review flashcards</Text>
                    <Text variant="bodyLarge">New: {metrics.new}</Text>
                    <Text variant="bodyLarge">Due: {metrics.due}</Text>
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
                        <Text variant="headlineSmall">Study</Text>
                    </Button>
                </View>
                <Button 
                    style={styles.flashcardBtn}
                    mode="contained"
                    labelStyle={{
                        fontSize: 40
                    }}
                    icon="cards-outline"
                    onPress={() => {
                        if (modalContent === 'srsFlashcards') showModal();
                        else setModalContent('srsFlashcards');
                    }}
                ></Button>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
        card: {
            margin: 5
        },
        cardContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        cardCover: {
            flex: 1,
            height: 100,
            backgroundColor: 'transparent'
        },
        cardMain: {
            width: 200,
            marginLeft: 10
        },
        textVocab: {

        },
        text: {},
        segmentButton: {
            borderRadius: 30,
            borderWidth: 0.5,
        },
        button: {
            alignItems: 'center',
            marginTop: 20,
            width: 200,
            borderRadius: 40,
            padding: 5
        },
        container: {
            padding: 10,
            flex: 1,
            alignItems: "stretch",
            // justifyContent: 'center',
        },
        main: {
            flex: 1,
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
            margin: 20,
            height: 500,
            borderRadius: 20
        },
        flashcardBtn: {
            alignSelf: 'flex-end',
            borderRadius: 100,
            width: 70,
            height: 70,
            justifyContent: 'center',
        }
    }
);