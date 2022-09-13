import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity} from 'react-native'
import {Button, Avatar, Title, Card,} from "react-native-paper";
import CountryFlag from "react-native-country-flag";
import axios from 'axios';
// import { Item } from "react-native-paper/lib/typescript/components/List/List";

export const Profile = () => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

    const [flashcards, setFlashcards] = useState([]);
    const [topTwo, setTopTwo] = useState([]);

    const tempUser = {
        userImage: "",
        userName: "Abraham Lincoln",
        userHandle: "Baberaham",
        userCountry: "us",
        userLearning: "jp",
    }

    useEffect(() => {
        axios
          .get("https://tangoatsumare-api.herokuapp.com/api/flashcards")
          .then((response: any) => {
            const flashcards =
              response.data;
            setFlashcards(flashcards)
            const temp = [flashcards[flashcards.length-1], flashcards[flashcards.length-2]];
            setTopTwo(temp); //typescript?
          });
    }, []);

    const displayCard = () => {

        return (
            <FlatList
            nestedScrollEnabled
            // columnWrapperStyle={{justifyContent: 'space-evenly'}}
            // numColumns={2}
            ItemSeparatorComponent={() => <View style={{width: 13}}/>}
            horizontal={true}
                data={topTwo}
                renderItem={({item}) => {
                    return (
                        <Card style={styles.card}>
                            <Card.Content>
                                {/* Need to change image cant be found source for line 53*/}
                                <Card.Cover source={{uri: item["image"] ?  item["image"] : 'https://avatars.githubusercontent.com/u/96172124?v=4'}} />
                                <Card.Title style={{backgroundColor: 'lightgray'}} title={item['target_word']} />
                            </Card.Content>
                        </Card>
                    );
                }}
            />
        );
    }
    

    return(
        <ScrollView nestedScrollEnabled>
            <View style={styles.profilePage}>

                {/* Profile title */}
                <Title style={styles.sectionTitle}>Profile</Title>
                <View style={styles.profileBox}>
                    {/* <Text> profile area </Text> */}
                    <View style={styles.profileInfo}>
                        <Text style={styles.text}>{tempUser.userName} <CountryFlag isoCode={tempUser.userCountry} size={22}/></Text>
                        <Text style={styles.text}>@{tempUser.userHandle}</Text>
                        <Text style={styles.text}>Currently learning: </Text>
                        <CountryFlag isoCode={tempUser.userLearning} size={22} />
                    </View>

                    <View style={styles.avatarBox}>
                        <Avatar.Image
                            source={{
                                uri:
                                    'https://avatars.githubusercontent.com/u/68458897?v=4',
                            }}
                            size={125}
                        />
                    </View>
                </View>

                {/* My Cards */}
                <Title style={styles.sectionTitle}>Recent Cards</Title>
                <View>
                    <View style={styles.cardBox}>
                        {displayCard()}
                    </View>
                        <Button onPress={() => {
                            console.log("My Cards button pressed");
                            // navigation.navigate("Cards"); ??
                        }}>
                            <Text>View All Cards</Text>
                        </Button>
                </View>
                {/* Favorites? */}
                <Title style={styles.sectionTitle}>Recent Favorites</Title>
                <View style={{marginBottom: 25}}>
                    <View style={styles.cardBox}>
                        {displayCard()}
                    </View>
                    <Button onPress={() => {
                            console.log("Favorites button pressed");
                            // navigation.navigate("Favorites"); ??
                        }}>
                            <Text>View All Favorites</Text>
                        </Button>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
        profilePage: {
            alignContent: 'center',
        },
        profileBox: {
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: 200,
        },
        profileInfo: {
            alignContent: 'center',
        },
        text: {
            fontSize: 16
        },
        avatarBox: {
            flex: 0,
            alignContent: 'center',
            borderWidth: 1,
            borderRadius: 100,
        },
        cardBox: {
            padding: 10,
        },
        card: {
            width: 180,
            height: 275,
            backgroundColor: 'gray',
            marginTop: 10,
            marginBottom: 10,
            borderRadius: 10,
        },
        sectionTitle: {
            textAlign: 'center',
            backgroundColor: '#f23535',
            color: 'white'
        },
    }
);