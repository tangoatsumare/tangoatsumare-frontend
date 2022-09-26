import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {HomeNav, SRSNav, CamNav, SearchNav} from "./main";
import {Settings} from "../screens/settings";
import {Profile} from "../screens/profile";
import {Login} from "../screens/login";
import {Register} from "../screens/register";
import {SRS} from "../screens/srs";
import {Camera} from "../screens/camera";
import { OCR } from "../screens/OCR";
import { Review } from "../screens/review";
import { ProfileSetup } from "../screens/profileSetup";
import React from 'react';
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Collection } from "./collection";
import { SingleCard } from "./card";
import { Front } from "../screens/front";
import { Back } from "../screens/back";
import { FeedCard } from "../screens/feedCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// const Tab = createMaterialBottomTabNavigator();
const Tab = createBottomTabNavigator();

export const TabHome = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({route}) => ({
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#FF4F4F', // hard coded
                tabBarStyle: {
                    backgroundColor: "#FFFFFF", // hard coded
                    borderTopWidth: 0,
                    // height: 100
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
            // shifting={true}
            // sceneAnimationEnabled={false}
            // barStyle={{ 
            //     backgroundColor: '#FFFFFF',
            //     // height: 80,
            // }}
            // labeled={false} // hide labels
            // activeColor={theme.colors.primary}
            
        >
            <Tab.Screen
                name="Home"
                component={HomeNav}
                options={{
                    // https://stackoverflow.com/questions/68674747/header-in-react-navigation-bottom-tabs
                    headerShown: false,
                    // tabBarIcon: ({ color, size }) => (
                    //     <MaterialCommunityIcons name="home-account" color={color} size={size} />
                    // ),
                }}
            />
            <Tab.Screen
                name="SRS"
                component={SRSNav}
                options={{
                    headerShown: false,
                    title: 'Review',
                    // tabBarIcon: ({ color, size }) => (
                    //     <MaterialCommunityIcons name="card-multiple-outline" color={color} size={size} />
                    // ),
                    // https://reactnavigation.org/docs/tab-based-navigation#add-badges-to-icons
                    tabBarBadge: "todo", // TODO: Show the ready to review cards here
                    tabBarBadgeStyle: {}
                }}
            />
            <Tab.Screen
                name="Camera"
                component={CamNav}
                options={{
                    headerShown: false,
                    // tabBarIcon: ({ color, size }) => (
                    //     <MaterialCommunityIcons name="camera" color={color} size={size} />
                    // ),
                }}
            />
        </Tab.Navigator>
    );
};


const RootStack = createNativeStackNavigator();

export const StackNav = () => {

    return (
        <RootStack.Navigator initialRouteName="Login">
            <RootStack.Screen name="TabHome" options={{headerShown: false, headerTitle:"Back"}} component={TabHome} />
            <RootStack.Screen name="Settings" component={Settings}/>
            <RootStack.Screen name="Profile" component={Profile}/>
            <RootStack.Screen name="Login" options={{headerShown: false}} component={Login} />
            <RootStack.Screen name="Register" component={Register}/>
            <RootStack.Screen name="ProfileSetup" component={ProfileSetup}/>
            <RootStack.Screen name="SRS" options={{headerTitle:"Review"}} component={SRS}/>
            <RootStack.Screen name="Camera" component={Camera}/>
            <RootStack.Screen name="OCR" component={OCR}/>
            <RootStack.Screen name="Collection" component={Collection}/>
            <RootStack.Screen name="Card" component={SingleCard}/>
            <RootStack.Screen name="FeedCard" component={FeedCard}/>
            <RootStack.Screen name="Front" component={Front}/>
            <RootStack.Screen name="Back" component={Back}/>
            <RootStack.Screen name="Review" component={Review}/>
            {/* <RootStack.Screen name="Search" component={Search}/> */}
        </RootStack.Navigator>
    )
}