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
import { Tag } from './home';

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
    handleEditSubmit: any,
    selectedTags: string[],
    setSelectedTags: any,
    tagsToFlashcards: object,
    tags: Tag[],
    setTags: any
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
    setSelectedTags: any,
    tags: Tag[],
    setTags: any
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
        handleEditSubmit,
        selectedTags,
        setSelectedTags,
        tagsToFlashcards,
        tags,
        setTags
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
        if (text || selectedTags.length !== 0) {
            updateFlashcardsCurated(flashcardsFeed);
        } else if (text === "" || selectedTags.length === 0) { // TO VERIFY
            resetFlashcardsCurated();
        }
    }, [text, selectedTags]);

    const updateFlashcardsCurated = (flashcards: object[]) => {
        
        // const verifyFlashcardAgainstSearchParams = (card:any , text: string, tags: string[]): boolean => {
        //     const checkText = (): boolean => card.target_word.includes(text);
        //     const checkHashTags = (): boolean => card.tags.some((item: string) => tags.includes(item));

        //     return checkText() || checkHashTags(); // TO CHANGE: a valid card should satisfy both conditions
        // }
        
        // curate the flashcardsCurated by the search text
        flashcards = flashcards.filter(card => card.target_word.includes(text));
            // verifyFlashcardAgainstSearchParams(card, text, selectedTags));

        // <----- TO TEST AND DEBUG -----> START

        // formatting an array of all selected tags' sub-array
        const filterArr = [];
        for (let i = 0; i < selectedTags.length; i++) {
            filterArr.push(tagsToFlashcards[selectedTags[i]]); 
            // the data would be something like: [[1,2,3,4],[3,4,5,6],[2,3]]
            // each item is each hashtag's flashcardIds array
        }

        // using reduce to get the intersection of multiple arrays
        const flashcardIntersectionArrFromSelectedTags = filterArr.length !== 0 ?
            filterArr.reduce((prev, curr) => {
                return curr.filter(value => prev.includes(value));
            })
            // for example, [[1,2,3,4],[3,4,5,6],[2,3]] would give [3]
            // which is representing the intersection of multiple hashtags' common flashcardId(s)
        : filterArr; // if filterArr is empty, that means no intersection. So simply assign filterArr here

        // grab all ids from the function incoming parameter
        const flashcardIdsFromUI: string[] = [];
        for (const item of flashcards) {
            flashcardIdsFromUI.push(item._id);
        }
        console.log("current cards that fulfill the search text", flashcardIdsFromUI);
        // the data would be like [1,2,3,4,5,6,7,8]
        // which is representing the flashcardIds that are stored in the flashcards variable

        // grab the intersected match between the flashcardIds and the flashcardIntersectionArrFromSelectedTags
        const matchingFlashcardIds = flashcardIntersectionArrFromSelectedTags.filter(item => {
            return flashcardIdsFromUI.includes(item);
        });
        console.log("the intersected cards:", matchingFlashcardIds);
        // for example
        // flashcardIntersectionArrFromSelectedTags is [3]
        // flashcardIdsFromUI is [1,2,3,4,5,6,7,8]
        // then matchingFlashcards would be [3], which is the intersection

        // set flashcardsCurated with the search text and/or the search hashtags
        // if no selectedTags, return the flashcards that are filtered by the text
        // else, return the result with both text and hashtag(s) filtering
        setFlashcardsCurated(selectedTags.length > 0 ? flashcards.filter(item => matchingFlashcardIds.includes(item._id)): flashcards);
        
        // <----- TO TEST AND DEBUG -----> END


        // https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
        // reference code example
        // const object = {
        //     food: [1,2,3],
        //     fashion: [3,4,5]
        // };
        // const tags = ["food","fashion"];
        // const arr1 = [];
        // for (let i = 0; i < tags.length; i++) {
        //     const result = object[tags[i]];
        //     arr1.push(result);
        // }
        // // arr1 is [[1,2,3],[3,4,5]]
        // const reduce = arr1.reduce((prev, curr) => curr.filter(value => prev.includes(value)))
        // // reduce is [3]


        // reference code example 
        // const tags = ["food", "lifestyle", "fashion"];
        // const flashcard = {
        //     tags: ["Apple", "food", "Banana"]
        // };
        // flashcard.tags.some(item => tags.includes(item));  ===> returns true


        // each card's tag array would need to include the tags within the selectedTags
        // && card.tags.some(item => selectedTag.includes(item));


        // TODO: curate the flashcardsCurated by hashtags
        // console.log(selectedTags);
        // console.log(flashcards);

        // get the tags array in the flashcard
        // const flashcardsTag = flashcards.map(card => card.tags);
        // console.log("tags in the matching flashcards:", flashcardsTag);
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

interface modifiedTag extends Tag {
    _id: string,
    tag: string,
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
        setSelectedTags,
        tags,
        setTags
    } = props;
    const [tagsModified, setTagsModified ] = useState<modifiedTag[]>([]);


    useEffect(() => {
        (async () => {
            if (textInputOnFocus && tags) {
                let result = tags;
                for (let i = 0; i < result.length; i++) {
                    result[i].isClicked = false;
                }
                // if (tags.length === 0) 
                setTagsModified(result);
            }
        })();
    }, [textInputOnFocus, tags]);

    const handleShowFlashcard = (flashcardID: string) => {
        navigation.navigate("Card", {id: flashcardID})
        // console.log(flashcardID);
    };

    const handleTagClick = (tag: modifiedTag) => {
        if (tagsModified) {           
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
            setTagsModified((prev) => {
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
                <View style={styles.tagsContainer}>
                    {tagsModified.length > 0 ?
                    tagsModified.map(item => {
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
                                    {/* <Text variant='labelSmall'> {"(0)"}</Text> */}
                                </Text>
                            </Chip>
                        );
                    })
                    : null}
                </View>
                <Divider bold={true} />
            </View>
            <ScrollView 
                contentContainerStyle={styles.bottomContainer}
            >
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
            </ScrollView>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    // https://medium.com/@kalebjdavenport/how-to-create-a-grid-layout-in-react-native-7948f1a6f949
    mainContainer: {
        // padding: 10,
        flex: 1,
        // justifyContent: 'flex-start',
        // alignItems: "stretch",
    },
    topContainer: {
        padding: 10,
        // flex: 1,
    },
    tagsContainer: {
        // padding: 10,
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
        // paddingBottom: 0
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
