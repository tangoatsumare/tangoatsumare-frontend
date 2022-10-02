import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import React, { useState, useEffect, useRef } from "react";
import { Card, Text, Avatar, Chip, useTheme } from 'react-native-paper';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Animated, Dimensions } from 'react-native'
import { Tag } from "./home";

const {width, height} = Dimensions.get('screen');

interface modifiedTag extends Tag {
    _id: string,
    tag: string,
    flashcards: string[],
    isClicked: boolean // additional property
}

export const SearchScreen = ({route}) => {
    const theme = useTheme();
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const { flashcards, tags } = route.params;
    
    const [tagsModified, setTagsModified ] = useState<modifiedTag[]>([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        (async () => {
            if (tags) {
                let result = tags;
                for (let i = 0; i < result.length; i++) {
                    result[i].isClicked = false;
                }
                // if (tags.length === 0) 
                setTagsModified(result);
            }
        })();
    }, [tags]);


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

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
            >
                <Text>Go back</Text>
            </TouchableOpacity>
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
                                    style={
                                        // item.isClicked? 
                                        {color: theme.colors.tertiary}
                                        // : 
                                        // {color: theme.colors.secondary}
                                    }
                                >
                                    {item.tag}
                                </Text>
                            </Chip>
                        );
                    })
                    : null}
                </View>
            <FlatList 
                        data={flashcards}
                        keyExtractor={(item) => item._id}
                        renderItem={({item}) => (
                            <SearchResultCard item={item} />
                        )
                        }
                    />
        </View>
    )
}

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
        // onPress={() => handleShowFlashcard(item)}
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
                        // left={(props) => (
                        //     <Avatar.Image {...props} 
                        //         source={{uri:item.picture_url}} 
                        //         onLoadEnd={() => setLoading(false)}
                        //         style={{backgroundColor: 'transparent'}}
                        //     />
                        // )}
                    />
                    <Card.Content>
                    </Card.Content>
                </Card>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    paddingTop: 40,
    backgroundColor: 'white'
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
}
);