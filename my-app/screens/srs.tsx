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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
                let flashcards: SRSTangoFlashcard[] = await HTTPRequest.getSRSFlashcardsByUser(userId);
                setFlashcardsAll(flashcards);

                // Updated to accomolate for deletion
                flashcards = flashcards.filter(card => !card.Flashcard[0].created_by?.includes("delete"));
                setFlashcardsReviewable(getReviewableSRSFlashcards(flashcards));
            } 
        })();
    },[isFocused]);
    
    // useEffect(() => {
    //     if (flashcardsAll) console.log(flashcardsAll);
    // }, [flashcardsAll]);

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
                            onPress={() => {
                                if (modalContent === 'setting') showModal();
                                else setModalContent('setting');
                            }}
                        >
                            <Icon name="cog" color="black" size={20} />
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
                                    {!item.Flashcard[0].created_by?.includes("delete") ? // check whether this card has been deleted
                                    <>
                                        <Card.Cover 
                                            source={{uri: item.Flashcard[0].picture_url ? item.Flashcard[0].picture_url : 'https://www.escj.org/sites/default/files/default_images/noImageUploaded.png'}} 
                                            style={styles.cardCover}
                                            resizeMode="contain"
                                        />
                                        <View style={styles.cardMain}>
                                            <Title style={styles.textVocab}>{item.Flashcard[0].target_word}</Title>
                                            <Paragraph style={styles.text}>{item.Flashcard[0].example_sentence}</Paragraph>
                                            <Paragraph>{item.counter} attempt{item.counter === 0 ? '': 's'}</Paragraph>
                                            <Paragraph>due {dayjs(item.due_date).fromNow()}</Paragraph>
                                        </View>
                                    </>
                                    : 
                                    <View>
                                        <Text>This card has been deleted by the card owner.</Text>
                                    </View>
                                    }
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
                        buttonColor={theme.colors.primary}
                        disabled={flashcardsReviewable.length === 0 ? true: false}
                        onPress={()=>{
                            navigation.navigate("Review", {
                                flashcardsAll: flashcardsReviewable
                            });
                        }}>
                        <Text variant="headlineSmall" style={{color: theme.colors.tertiary}}>Study</Text>
                    </Button>
                </View>
                <View style={styles.bottom}>
                    <Button 
                        labelStyle={styles.flashcardBtn}
                        onPress={() => {
                            if (modalContent === 'srsFlashcards') showModal();
                            else setModalContent('srsFlashcards');
                        }}
                    >
                        <Icon name="cards" size={30} color="white" />
                    </Button>
                </View>
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
        main: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: 'white',
        },
        bottom: {
            // flexDirection: 'row',
            justifyContent: 'flex-end',
            alignSelf: 'flex-end',
            width: 70,
            height: 70,
            borderRadius: 100,
            shadowColor: 'rgba(0,0,0,0.1)',
            shadowOffset: { width: 3, height: 20 },
            shadowOpacity: 0.8,
            shadowRadius: 15,
            backgroundColor: "rgba(0,0,0,0.5)"
        },
        flashcardBtn: {
            color: 'black',
            padding: 10
        }
    }
);