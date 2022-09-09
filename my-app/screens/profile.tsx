import { useNavigation} from "@react-navigation/core";
import { StackNavigationProp} from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'

import React from "react";
import {View, Text, StyleSheet, ScrollView} from 'react-native'
import {Button, Divider, Avatar, Title, Card} from "react-native-paper";

export const Profile = () => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

    return(
        <ScrollView>
            <View style={styles.profilePage}>

                {/* Profile title */}
                <Title style={styles.sectionTitle}>Profile</Title>
                <View style={styles.profileBox}>
                    {/* <Text> profile area </Text> */}
                    <View style={styles.profileInfo}>
                        <Text>profile info box</Text>

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
                <Title style={styles.sectionTitle}>My Cards</Title>
                <View>
                    {/* <Text> card area </Text> */}
                    <View style={styles.cardBox}>

                        <Card style={styles.card}>
                            <Card.Content>
                                {/* <Title>awerawer</Title> */}
                                <Card.Cover source={{uri:
                                    'https://avatars.githubusercontent.com/u/96172124?v=4'}}/>
                                    <Card.Title title="test card" />
                            </Card.Content>
                        </Card>
                        
                        <Card style={styles.card}>
                            <Card.Content>
                                {/* <Title>awerawer</Title> */}
                                <Card.Cover source={{uri:
                                    'https://avatars.githubusercontent.com/u/68458897?v=4'}}/>
                                    <Card.Title title="test card" />
                            </Card.Content>
                        </Card>

                        <Card style={styles.card}>
                            <Card.Content>
                                {/* <Title>awerawer</Title> */}
                                <Card.Cover source={{uri:
                                    'https://avatars.githubusercontent.com/u/68458897?v=4'}}/>
                                    <Card.Title title="test card" />
                            </Card.Content>
                        </Card>

                        <Card style={styles.card}>
                            <Card.Content>
                                {/* <Title>awerawer</Title> */}
                                <Card.Cover source={{uri:
                                    'https://avatars.githubusercontent.com/u/68458897?v=4'}}/>
                                    <Card.Title title="test card" />
                            </Card.Content>
                        </Card>

                    </View>
                </View>
                {/* <Divider style={styles.divider}/> */}

                {/* Favorites? */}
                <Title style={styles.sectionTitle}>Favorites</Title>
                <View>
                    <Text> fav card area </Text>
                    <View>
                        <Card style={styles.card}>
                            <Card.Content>
                                {/* <Title>awerawer</Title> */}
                                <Card.Cover source={{uri:
                                    'https://avatars.githubusercontent.com/u/96172124?v=4'}}/>
                                    <Card.Title title="test card" />
                            </Card.Content>
                        </Card>
                    </View>
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
            backgroundColor: 'pink',
        },
        profileBox: {
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            // alignContent: 'center',
            // borderColor: 'green',
            backgroundColor: 'blue',
            height: '25%',
        },
        profileInfo: {
            alignContent: 'center',
            backgroundColor: 'green',
        },
        avatarBox: {
            // borderColor: 'black',
            flex: 0,
            alignContent: 'center',
            backgroundColor: 'yellow',
            // margin: 0,
            // marginLeft: 20,
        },
        cardBox: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
            backgroundColor: 'red',
            
        },
        card: {
            width: 180,
            height: 250,
            backgroundColor: 'gold',
            marginTop: 10,
            marginBottom: 10,
        },
        sectionTitle: {
            textAlign: 'center',
            backgroundColor: 'magenta',
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