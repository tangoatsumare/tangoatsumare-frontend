import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import { useEffect, useRef, useState } from 'react';
import {ScrollView, View, StyleSheet, FlatList} from 'react-native';
import { Button, Divider, Text, TextInput, Searchbar, Card, Avatar, Chip } from "react-native-paper";
import { Keyboard, Dimensions } from 'react-native';
import { HTTPRequest } from '../utils/httpRequest';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from "react-native-gesture-handler";

interface SearchBarProps {
    text: string,
    setText: any,
    textInputOnFocus: boolean,
    setTextInputOnFocus: any,
    flashcardsCurated: object[],
    setFlashcardsCurated: any,
    flashcardsFeed: object[],
    submitIsClick: boolean,
    setSubmitIsClick: any,
    resetIsClick: boolean,
    flashcardsMaster: object[],
    hashTagSearchMode: boolean,
    setHashTagSearchMode: any,
    handleEditSubmit: any
}

interface SearchBodyProps {
    text: string,
    setText: any,
    textInputOnFocus: boolean,
    setTextInputOnFocus: any,
    flashcardsCurated: object[],
    hashTagSearchMode: boolean,
    setHashTagSearchMode: any,
    handleEditSubmit: any,
    selectedTags: string[],
    setSelectedTags: any 
}

const { width } = Dimensions.get('window');

export const SearchBar = (props: SearchBarProps) => {
    const inputRef = useRef();
    const { 
        text, 
        setText, 
        textInputOnFocus, 
        setTextInputOnFocus, 
        flashcardsCurated, 
        setFlashcardsCurated,
        flashcardsFeed,
        submitIsClick,
        setSubmitIsClick,
        resetIsClick,
        flashcardsMaster,
        hashTagSearchMode,
        setHashTagSearchMode,
        handleEditSubmit
    } = props;

    const [pressed, setPressed] = useState(false);

    const resetFlashcardsCurated = () => {
        setFlashcardsCurated(flashcardsMaster);
    };

    useEffect(() => {
        if (textInputOnFocus) {
            setFlashcardsCurated(flashcardsFeed); // TO CHANGE
        } else if (!textInputOnFocus && !text) {
            setFlashcardsCurated(''); // TO CHANGE
        }
    }, [textInputOnFocus]);

    useEffect(() => {
        if (text) {
            updateFlashcardsCurated(flashcardsFeed);
        } else if (text === "") {
            resetFlashcardsCurated();
        }
    }, [text]);

    const updateFlashcardsCurated = (flashcards: object[]) => {
        flashcards = flashcards.filter(card => card.target_word.includes(text));
        setFlashcardsCurated(flashcards);
    };

    return (
        <View style={{
            flex: 1,
            marginTop: 5,
            marginBottom: 5
        }}>
            <TextInput 
                ref={inputRef}
                style={{
                    flex: 1, 
                    justifyContent: 'center',
                    maxWidth: width / 2,
                    width: width / 2
                }}
                mode="outlined"
                // TO FIX
                // issue with japanese typing getting messed up due to the state changes
                // https://github.com/facebook/react-native/issues/19339

                // the following reactive code works except for Language such as Japanese
                // value={text}
                // onChangeText={text => setText(text)}
                placeholder="search"
                value={pressed || resetIsClick ? '': null}
                // value={text}
                // value={pressed || resetIsClick ? '': text}
                onChangeText={(text) => {
                    setText(text); // save it in a state
                    if (pressed) {
                        setPressed(false);
                    }
                }}
                onSubmitEditing={handleEditSubmit}
                onFocus={() => setTextInputOnFocus(true)}
                // onBlur={() => console.log('byebye')} // trigger during blur event
                left={<TextInput.Icon icon="magnify" />}
                right={textInputOnFocus? 
                    <TextInput.Icon 
                        icon="close-circle" 
                        onPress={() => {
                            setText('');
                            setPressed(true);
                            Keyboard.dismiss();
                        }}
                    />: null}
            />

        </View>
    );
};

interface Tag {
    _id: string,
    tag: Tag,
    flashcards: string[],
    isClicked: boolean // additional property
}

export const SearchBody = (props: SearchBodyProps) => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const theme = useTheme();
    const { 
        text, 
        setText, 
        textInputOnFocus, 
        setTextInputOnFocus, 
        flashcardsCurated,
        hashTagSearchMode,
        setHashTagSearchMode,
        handleEditSubmit,
        selectedTags,
        setSelectedTags
    } = props;
    const [tags, setTags ] = useState<Tag[]>([]);


    useEffect(() => {
        (async () => {
            if (textInputOnFocus) {
                let result = await HTTPRequest.getTags();
                for (let i = 0; i < result.length; i++) {
                    result[i].isClicked = false;
                }
                // if (tags.length === 0) 
                setTags(result);
            }
        })();
    }, [textInputOnFocus]);

    const handleShowFlashcard = (flashcardID: string) => {
        navigation.navigate("Card", {id: flashcardID})
        // console.log(flashcardID);
    };

    const handleTagClick = (tag: Tag) => {
        if (tags) {           
            // set to text
            // setText(`#${tag.tag}`);

            // update the currentSelected tags
            setSelectedTags((prev) => {
                // if it is in a clicked state before, remove it from selectedTags
                if (tag.isClicked) {
                    return prev.filter(item => item !== tag.tag);
                }
                // else, add to selected tags
                else {
                    return prev.concat(tag.tag);
                }
            });

            // update isClicked value
            setTags((prev) => {
                let result = [...prev];
                for (let i = 0; i < result.length; i++) {
                    if (result[i]._id === tag._id) {
                        result[i].isClicked = !result[i].isClicked;
                    }
                }
                return result;
            })
        }
    };

    useEffect(() => {
        if (selectedTags.length > 0) {
            // turn on hashtag search mode if there exists isClicked
            setHashTagSearchMode(true);
        } else {
            setHashTagSearchMode(false);
        }
    }, [selectedTags]);

    // useEffect(() => {
    //     if (hashTagSearchMode) {
    //         console.log(selectedTags);
    //     }
    // }, [hashTagSearchMode]);

    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            <View style={styles.topContainer}>
                <Text variant="headlineSmall">Tags</Text>
                <Text>MVP: to allow single click</Text>
                <Text>Advanced: to allow multiple clicks possible</Text>
                <View style={styles.tagsContainer}>
                    {tags.length > 0 ?
                    tags.map(item => {
                        return (
                            <Chip
                                key={item._id} 
                                style={item.isClicked? {...styles.tagButton, backgroundColor:theme.colors.secondary}: styles.tagButton }
                                mode="flat"
                                selected={item.isClicked}
                                onPress={() => handleTagClick(item)}
                            >
                                <Text variant='bodyMedium'>
                                    #{item.tag}
                                    <Text variant='labelSmall'> {"(0)"}</Text>
                                </Text>
                            </Chip>
                        );
                    })
                    : null}
                </View>
                <Divider bold={true} />
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.resultsContainer}>
                    <Text variant="headlineSmall">Results</Text>
                    {flashcardsCurated && flashcardsCurated.length > 0 &&
                        flashcardsCurated.map(card => {
                            return (
                                <View style={{marginBottom: 5}} key={card._id}>
                                    <Card
                                        onPress={() => handleShowFlashcard(card._id)}
                                    >
                                        <Card.Title 
                                            title={card.target_word} 
                                            subtitle={card.example_sentence}
                                            left={(props) => <Avatar.Image {...props} source={{uri:card.picture_url}} />}
                                        />
                                        <Card.Content>
                                        </Card.Content>
                                    </Card>
                                </View>
                            );
                        })
                    }
                </View>
                {text !== '' || hashTagSearchMode ? 
                    <TouchableOpacity 
                        style={styles.searchButtonContainer}
                        onPress={handleEditSubmit}
                    >
                        <Button
                            style={styles.searchButton}
                        >
                            <Icon name="search" size={20} color="white" />
                        </Button> 
                    </TouchableOpacity>
                : null}
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    // https://medium.com/@kalebjdavenport/how-to-create-a-grid-layout-in-react-native-7948f1a6f949
    mainContainer: {
        padding: 10,
        flex: 1,
        // justifyContent: 'flex-start',
        // alignItems: "stretch",
    },
    topContainer: {
        // padding: 10,
        // flex: 1,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: width,
        marginHorizontal: 'auto'
    },
    tagButton: {
        minWidth: 125,
        maxWidth: 200,
        margin: 5,
        borderRadius: 30,
    },

    bottomContainer: {
        padding: 10,
        flex: 1,
        alignItems: "stretch",
    },
    resultsContainer: {
        flex: 1,

    },
    searchButtonContainer: {
        justifyContent: 'center',
        alignSelf: 'flex-end',
        width: 70,
        height: 70,
        borderRadius: 100,
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 3, height: 20 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        backgroundColor: "rgba(0,0,0,0.7)"
    },
    searchButton: {
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        padding: 10
    }
});
