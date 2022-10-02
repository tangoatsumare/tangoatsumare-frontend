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
import { SingleCard } from "./card";
import { FeedCard } from "../screens/feedCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTangoContext } from "../contexts/TangoContext";
import {SearchScreen} from "../screens/SearchScreen";

const Tab = createBottomTabNavigator();

export const TabHome = () => {
  const { metrics } = useTangoContext();

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
                         : undefined,
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
            <RootStack.Screen name="Search" 
                options={{
                    headerShown: false, 
                    // headerTitle:"Back"
                }} 
                component={SearchScreen} 
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
            <RootStack.Screen 
                name="Camera" 
                component={Camera}
                options={{
                    headerShadowVisible: false,
                    headerTitle: '',
                    headerTintColor: 'black',
                    headerStyle: {},
                }}
            />
            <RootStack.Screen 
                name="OCR" 
                component={OCR}
                options={{
                    headerShadowVisible: false,
                    headerTitle: 'Select a word to learn',
                    headerTintColor: 'black',
                    headerStyle: {},
                }}
            />
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