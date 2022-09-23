import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useRef, useState } from 'react';
import {ScrollView, View, StyleSheet, FlatList} from 'react-native';
import { Button, Divider, Text, TextInput, Searchbar, Card, Avatar } from "react-native-paper";
import { Keyboard, Dimensions } from 'react-native';
import { HTTPRequest } from '../utils/httpRequest';

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
    flashcardsMaster: object[]
}

interface SearchBodyProps {
    text: string,
    setText: any,
    textInputOnFocus: boolean,
    setTextInputOnFocus: any,
    flashcardsCurated: object[]
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
        flashcardsMaster
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

    const handleEditSubmit = () => {
        // console.log("edit submit is hit");
        setSubmitIsClick(true);
        // change the screen back to the feed/collection
        setTextInputOnFocus(false);
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
                    // alignItems: 'center', 
                    justifyContent: 'center',
                    maxWidth: width / 2,
                    width: width / 2
                    // fontSize: 20
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
                            // resetFlashcardsCurated();
                        }}
                    />: null}
            />

        </View>
    );
};

interface Tag {
    _id: string,
    tag: Tag,
    flashcards: string[]
}

export const SearchBody = (props: SearchBodyProps) => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const { text, setText, textInputOnFocus, setTextInputOnFocus, flashcardsCurated } = props;
    const [tags, setTags ] = useState<Tag[]>([]);

    const handleShowFlashcard = (flashcardID: string) => {
        navigation.navigate("Card", {id: flashcardID})
        // console.log(flashcardID);
      }

    useEffect(() => {
        (async () => {
            if (textInputOnFocus) {
                if (tags.length === 0) setTags(await HTTPRequest.getTags());
            }
        })();
    }, [textInputOnFocus]);

    return (
        <ScrollView>
            <Text variant="headlineSmall">Tags</Text>
            <Text>when clicked, the result list is updated</Text>
            <Text>to allow multiple clicks possible</Text>
            <View style={styles.tagsContainer}>
                {tags.length > 0 ?
                tags.map(item => {
                    return (
                        <Button key={item._id} style={styles.tagButton} mode="contained-tonal">
                        <Text variant='bodyMedium'>{item.tag}
                            <Text variant='labelSmall'> {"(0)"}</Text>
                        </Text>
                    </Button>
                    );
                })
                : null}
            </View>
            <Divider bold={true} />
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
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    // https://medium.com/@kalebjdavenport/how-to-create-a-grid-layout-in-react-native-7948f1a6f949
    tagsContainer: {
        // padding: 10,
        // alignItems: 'center',
        // justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        // marginHorizontal: "auto",
        width: width
    },
    tagButton: {
        minWidth: 130,
        maxWidth: 200,
        flex: 1,
        margin: 5,
        borderRadius: 30,
        // alignItems: 'center',
        // justifyContent: 'center',
    }
});
