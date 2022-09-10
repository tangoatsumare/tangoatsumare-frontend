import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity} from 'react-native'
import {Button, Divider, Avatar, Title, Card,} from "react-native-paper";
import CountryFlag from "react-native-country-flag";
import axios from 'axios';
import { Item } from "react-native-paper/lib/typescript/components/List/List";
// import {Collection} from '../Components/collection';

// const [test, setTest] = useState();


export const Profile = () => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

    const [flashcards, setFlashcards] = useState([]);

    useEffect(() => {
        axios
          .get("https://tangoatsumare-api.herokuapp.com/api/flashcards")
          .then((response: any) => {
            const flashcards =
              response.data;
            setFlashcards(flashcards)
          });
    }, []);

    const handleShowFlashcard = (flashcardName: any) => {
        //navigate
        console.log(flashcardName)
    }

    const displayCard = () => {
        const topTwo = [flashcards[flashcards.length-1], flashcards[flashcards.length-2]];
        
        return (
            <FlatList
            nestedScrollEnabled
            columnWrapperStyle={{justifyContent: 'space-evenly'}}
            numColumns={2}
                data={topTwo}
                renderItem={({item}) => {
                    return (
                        <Card style={styles.card}>
                            <Card.Content>
                                {/* <Card.Cover source={{uri: 'https://avatars.githubusercontent.com/u/96172124?v=4'}} /> */}
                                <Card.Cover source={{uri: item["image"] ?  item["image"] : 'https://avatars.githubusercontent.com/u/96172124?v=4'}} />
                                <Card.Title style={{backgroundColor: 'lightgray'}} title={item['target_word']} />
                            </Card.Content>
                        </Card>
                    );
                }}
            />
            // <Card style={styles.card}>
            //     <Card.Content>
            //         <Card.Cover source={{uri: 'https://avatars.githubusercontent.com/u/96172124?v=4'}} />
            //         <Card.Title title="test card" />
            //     </Card.Content>
            // </Card>
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
                        <Text style={styles.text}>Abraham Lincoln <CountryFlag isoCode="us" size={22}/></Text>
                        <Text style={styles.text}>@BaberahamLincoln</Text>
                        <Text style={styles.text}>Currently learning: </Text>
                        <CountryFlag isoCode="jp" size={22} />
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
                    {/* <Divider style={styles.divider}/> */}

                {/* <Divider style={styles.divider}/> */}

                {/* My Cards */}
                <Title style={styles.sectionTitle}>Recent Cards</Title>
                {/* <View>
                    {displayFlashcard(flashcards)}
                </View> */}
                <View>
                    {/* {displayFlashcard(flashcards)} */}
                    {/* <Text> card area </Text> */}
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
                {/* <Divider style={styles.divider}/> */}

                {/* Favorites? */}
                <Title style={styles.sectionTitle}>Recent Favorites</Title>
                <View style={{marginBottom: 25}}>
                    <View>
                        {displayCard()}
                    </View>
                    <Button onPress={() => {
                            console.log("Favorites button pressed");
                            // navigation.navigate("Favorites"); ??
                        }}>
                            <Text>View All Favorites</Text>
                        </Button>
                </View>
                {/* <Divider style={styles.divider}/> */}
            </View>
        </ScrollView>
    )

    // return (
    //     <View style={styles.container}>
    //         <Button icon="eye" mode="contained" style={styles.button}
    //                     onPress={()=>{
    //                         navigation.navigate("Settings")
    //                     }}>
    //                 <Text>To Settings</Text>
    //             </Button>
    //     </View>
    // )
}

const styles = StyleSheet.create({
        profilePage: {
            // flex: 1,
            alignContent: 'center',
            // justifyContent: 'center',
            // backgroundColor: '#f2eded',
        },
        profileBox: {
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            // alignContent: 'center',
            // borderColor: 'green',
            // backgroundColor: 'blue',
            height: 200,
        },
        profileInfo: {
            alignContent: 'center',
            // backgroundColor: 'green',
        },
        text: {
            fontSize: 16
        },
        avatarBox: {
            // borderColor: 'black',
            flex: 0,
            alignContent: 'center',
            // backgroundColor: 'yellow',
            borderWidth: 1,
            borderRadius: 100,
            // margin: 0,
            // marginLeft: 20,
        },
        cardBox: {
            flexDirection: 'row',
            // flexWrap: 'wrap',
            justifyContent: 'space-evenly',
            // backgroundColor: 'red',
            
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
        button: {
            alignItems: 'center',
        },
        // container: {
        //     flex: 1,
        //     alignItems: 'center',
        //     justifyContent: 'center',
        // },
        divider: {
            backgroundColor: 'orange',
        },
    }
);