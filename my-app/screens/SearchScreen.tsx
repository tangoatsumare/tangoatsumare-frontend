import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import React, { useState, useEffect, useRef } from "react";
import { Card, Text, Avatar, Chip, useTheme, TextInput as PaperTextInput } from 'react-native-paper';
import { TextInput, View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Animated, Dimensions, Keyboard } from 'react-native'
import { Tag } from "./home";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTangoContext } from "../contexts/TangoContext";
import {getFlashcardsHashTagsKeywordIntersection} from '../utils/helper';
const {width, height} = Dimensions.get('screen');

interface modifiedTag extends Tag {
    _id: string,
    tag: string,
    flashcards: string[],
    isClicked: boolean // additional property
}

export const SearchScreen = () => {
    const {
        tags,
        selectedTags,
        setSelectedTags,
        flashcardsMaster,
        flashcardsCurated,
        setFlashcardsCurated,
        tagsToFlashcards, 
        hashTagSearchMode,
        setHashTagSearchMode,
        searchMode,
        setSearchMode,
        text,
        setText
    } = useTangoContext();
    
    const theme = useTheme();
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    
    const [tagsModified, setTagsModified ] = useState<modifiedTag[]>([]);

    useEffect(() => {
        if (selectedTags.length > 0) {
            // turn on hashtag search mode if there exists isClicked
            setHashTagSearchMode(true);
        } else {
            setHashTagSearchMode(false);
        }
    }, [selectedTags]);

    useEffect(() => {
        (async () => {
            if (tags) {
                let result = tags;
                if (selectedTags.length !== 0) {
                    for (let i = 0; i < result.length; i++) {
                        if (selectedTags.find(tag => tag === result[i].tag)) {
                            result[i].isClicked = true;
                        } else result[i].isClicked = false;
                    }
                }
                else {
                    for (let i = 0; i < result.length; i++) {
                        result[i].isClicked = false;
                    }
                }
                setTagsModified(result);
            }
        })();
    }, [tags]);

    useEffect(() => {
        if (text || selectedTags.length !== 0) {
            setSearchMode(true);
            setFlashcardsCurated(getFlashcardsHashTagsKeywordIntersection(flashcardsMaster, selectedTags, tagsToFlashcards, text));
        } else if (text === "" || selectedTags.length === 0) { // TO VERIFY
            resetFlashcardsCurated();
        } else if (text === "" && selectedTags.length === 0) {
            setSearchMode(false);
        }
    }, [text, selectedTags]);

    const resetFlashcardsCurated = () => {
        setFlashcardsCurated(flashcardsMaster);
    };

    const handleEditSubmit = () => {
        if (text || selectedTags.length !== 0) {
            clearKeyboard(); // change the screen back to the feed/collection  
            navigation.goBack();
        } else {
            console.log('search not executed due to empty string');
        }
    };

    const clearKeyboard = () => {
        Keyboard.dismiss();
      };

    const handleTagClick = (tag: modifiedTag) => {
        if (tagsModified) {           
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

    const handleShowFlashcard = (item: any) => {
        navigation.navigate("FeedCard", {item: item})
    };
    
    const SearchResultCard = ({item}) => {
        // const [loading, setLoading] = useState(true);
        const [loading, setLoading] = useState(false);
        const fadeAnim = useRef(new Animated.Value(0)).current;
    
        useEffect(() => {
          if (!loading) {
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true
            }).start();
          }
        }, [loading]);
    
        return (
            <TouchableOpacity 
            style={{marginBottom: 5}} key={item._id}
            onPress={() => handleShowFlashcard(item)}
            activeOpacity={1}
            >
                <Animated.View
                    style={{opacity: fadeAnim}}
                >
                    <Card
                        mode="contained"
                        style={{backgroundColor: "transparent"}}
                    >
                        <Card.Title 
                            title={item.target_word} 
                            titleVariant="headlineSmall"
                            subtitle={item.example_sentence}
                            left={(props) => (
                                <Avatar.Image {...props} 
                                    source={require('../assets/splash.png')}
                                    // source={item.picture_url && {uri:item.picture_url}} 
                                    onLoadEnd={() => setLoading(false)}
                                    style={{backgroundColor: 'transparent'}}
                                />
                            )}
                        />
                        <Card.Content>
                        </Card.Content>
                    </Card>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View 
                style={{
                    marginTop: 10,
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: theme.colors.tertiary,
                    borderColor: theme.colors.primary,
                    borderWidth: 0.5,
                    borderRadius: 30,
                    width: width / 1.5, // ratio that the search bar takes up the page
                    height: 30,
                }}
            >
                <Icon 
                    name="magnify" 
                    size={20} 
                    color={theme.colors.primary}     
                    style={{
                        marginLeft: 10 // hard coded
                    }}   
                />
                <TextInput 
                    style={{
                        marginLeft: 10,
                        width: width / 2 ,
                        fontSize:  15
                    }}
                    placeholder="Search Tango"
                    value={text}
                    onChangeText={(text) => setText(text)}
                    autoFocus={true}
                />
                <TouchableOpacity
                onPress={() => {
                    resetFlashcardsCurated();
                    setSelectedTags([]);
                    setText('');
                    navigation.goBack();
                }}
                style={{
                    marginRight: 100 // hard coded
                }}   
                >
                    <Icon 
                        name="close" 
                        size={20} 
                        color={theme.colors.primary}        
                    />
                </TouchableOpacity>
               
            </View>
            <View style={styles.tagsContainer}>
                {tagsModified.length > 0 ?
                tagsModified.map(item => {
                    return (
                        <Chip
                            key={item._id} 
                            style={item.isClicked? 
                                {...styles.tagButton, backgroundColor:theme.colors.secondary}
                                : {...styles.tagButton, backgroundColor: theme.colors.primary }
                            }
                            mode="flat"
                            selected={item.isClicked}
                            onPress={() => handleTagClick(item)}
                            selectedColor={theme.colors.tertiary}
                        >
                            <Text 
                                variant='bodyMedium'
                                style={{
                                    color: theme.colors.tertiary,
                                    textAlign: 'center'
                                }}
                            >
                                {item.tag}
                            </Text>
                        </Chip>
                    );
                })
                : null}
            </View>
            <View style={{
                padding: 20,
                width: width,
                flex: 1,
            }}>
                {flashcardsCurated && flashcardsCurated.length > 0 ?
                    <FlatList 
                        data={flashcardsCurated}
                        keyExtractor={(item) => item._id}
                        renderItem={({item}) => (
                            <SearchResultCard item={item} />
                        )
                        }
                    />
                :
                    <View style={{flex: 1}}></View> // empty placeholder to fill the div when flatlist is empty
                }
                {text !== '' || hashTagSearchMode ? 
                        <View style={styles.searchButtonContainer}>
                            <TouchableOpacity 
                                style={styles.searchButton}
                                onPress={handleEditSubmit}
                            >
                                <Icon 
                                    name="magnify" 
                                    size={35} 
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
        backgroundColor: 'white',
        width: width,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagButton: {
        width: 100,
        margin: 2,
        borderRadius: 30,
        flexDirection: 'row',
    },
    searchButtonContainer: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        justifyContent: 'center',
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
    }
}
);