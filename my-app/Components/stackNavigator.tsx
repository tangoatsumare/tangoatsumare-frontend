import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {HomeNav, SRSNav, CamNav} from "./main";
import {Settings} from "../screens/settings";
import {Profile} from "../screens/profile";
import {Login} from "../screens/login";
import {Register} from "../screens/register";
import {SRS} from "../screens/srs";
import {Camera} from "../screens/camera";
import { OCR } from "../screens/OCR";
import { Review } from "../screens/review";
import { ProfileSetup } from "../screens/profileSetup";
import React, {useEffect, useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Collection } from "./collection";
import { SingleCard } from "./card";
import { Front } from "../screens/front";
import { Back } from "../screens/back";
import { FeedCard } from "../screens/feedCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { HTTPRequest, UserId } from "../utils/httpRequest";
import { getAuth } from "firebase/auth";
import { useIsFocused } from "@react-navigation/native";
import { 
    SRSTangoFlashcard,
    getReviewableSRSFlashcards
 } from "../utils/supermemo";

const Tab = createBottomTabNavigator();

export const TabHome = () => {
    const auth = getAuth();
    const userId: UserId = auth.currentUser?.uid;
    const isFocused = useIsFocused();
    const [flashcardsAll, setFlashcardsAll] = useState<SRSTangoFlashcard[]>([]);
    const [ flashcardsReviewable, setFlashcardsReviewable ] = useState<SRSTangoFlashcard[]>([]);
    const [ metrics, setMetrics ] = useState({
        new: 0,
        due: 0
    });

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

    useEffect(() => {
        if (flashcardsReviewable) {
            const newCards = flashcardsReviewable.filter(card => card.counter === 0).length;
            const dueCards = flashcardsReviewable.filter(card => card.counter !== 0).length;
            
            setMetrics({
                new: newCards,
                due: dueCards
            });

        }
    }, [flashcardsReviewable]);

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({route}) => ({
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#FF4F4F', // hard coded
                tabBarStyle: {
                    backgroundColor: "#FFFFFF", // hard coded
                    borderTopWidth: 0
                },
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    if (route.name === 'Home') {
                      iconName = 'home-variant-outline'; // per figma
                    } else if (route.name === 'SRS') {
                      iconName = 'card-multiple-outline';  // per figma
                    } else if (route.name === 'Camera') {
                      iconName = 'camera-plus-outline';  // per figma
                    } 
                    return <MaterialCommunityIcons name={iconName} size={30} color={color} />;
                  },
            })}   
        >
            <Tab.Screen
                name="Home"
                component={HomeNav}
                options={{
                    // https://stackoverflow.com/questions/68674747/header-in-react-navigation-bottom-tabs
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="SRS"
                component={SRSNav}
                options={{
                    headerShown: false,
                    title: 'Review',
                    // https://reactnavigation.org/docs/tab-based-navigation#add-badges-to-icons
                    tabBarBadge: metrics ? 
                        metrics.new + metrics.due === 0 ?
                         undefined : metrics.new + metrics.due
                         : undefined, // TODO: Show the ready to review cards here
                    tabBarBadgeStyle: {}
                }}
            />
            <Tab.Screen
                name="Camera"
                component={CamNav}
                options={{
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};


const RootStack = createNativeStackNavigator();

export const StackNav = () => {

    return (
        <RootStack.Navigator initialRouteName="Login">
            <RootStack.Screen name="TabHome" 
                options={{
                    headerShown: false, 
                    headerTitle:"Back"
                }} 
                component={TabHome} 
            />
            <RootStack.Screen name="Settings" component={Settings}/>
            <RootStack.Screen name="Profile" component={Profile} options={{headerShadowVisible: false,
                    headerTitle: '',
                    headerTintColor: 'black',
                    headerStyle: {},}}/>
            <RootStack.Screen name="Login" options={{headerShown: false}} component={Login} />
            <RootStack.Screen name="Register" component={Register}/>
            <RootStack.Screen name="ProfileSetup" component={ProfileSetup}/>
            <RootStack.Screen name="SRS" 
                options={{
                    headerShadowVisible: false,
                    headerTitle: '',
                    headerTintColor: 'black',
                    headerStyle: {},
                }} 
                component={SRS}
            />
            <RootStack.Screen name="Camera" component={Camera}/>
            <RootStack.Screen name="OCR" component={OCR}/>
            <RootStack.Screen name="Collection" component={Collection}/>
            <RootStack.Screen 
                name="Card" 
                component={SingleCard} 
                options={{
                    headerShadowVisible: false,
                    headerTitle: '',
                    headerTintColor: 'black',
                    headerStyle: {},
                }}
            />
            <RootStack.Screen 
                name="FeedCard" 
                component={FeedCard}
                options={{
                    headerShadowVisible: false,
                    headerTitle: '',
                    headerTintColor: 'black',
                    headerStyle: {},
                }}
            />
            <RootStack.Screen name="Front" component={Front}/>
            <RootStack.Screen name="Back" component={Back}/>
            <RootStack.Screen 
                name="Review" 
                component={Review}
                options={{
                    headerShadowVisible: false,
                    headerTitle: '',
                    headerTintColor: 'black',
                    headerStyle: {},
                }}
            />
        </RootStack.Navigator>
    )
}