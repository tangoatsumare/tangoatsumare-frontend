import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {HomeNav, SRSNav, CamNav} from "./main";
import {Settings} from "../screens/settings";
import {Profile} from "../screens/profile";
import {Login} from "../screens/login";
import {Register} from "../screens/register";
import {SRS} from "../screens/srs";
import {Camera} from "../screens/camera";
import { OCR } from "../screens/OCR";
import React from 'react';
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";

const Tab = createMaterialBottomTabNavigator();

export const TabHome = () => {

    return (
        <Tab.Navigator
            initialRouteName="Home"
            shifting={true}
            sceneAnimationEnabled={false}
        >
            <Tab.Screen
                name="Home"
                component={HomeNav}
                options={{
                    tabBarIcon: 'home-account',
                }}
            />
            <Tab.Screen
                name="SRS"
                component={SRSNav}
                options={{
                    tabBarIcon: 'card-multiple-outline',
                }}
            />
            <Tab.Screen
                name="Camera"
                component={CamNav}
                options={{
                    tabBarIcon: 'camera',
                }}
            />
        </Tab.Navigator>
    );
};


const RootStack = createNativeStackNavigator();

export const StackNav = () => {

    return (
        <RootStack.Navigator initialRouteName="TabHome">
            <RootStack.Screen name="TabHome" options={{headerShown: false, headerTitle:"Back"}} component={TabHome} />
            <RootStack.Screen name="Settings" component={Settings}/>
            <RootStack.Screen name="Profile" component={Profile}/>
            <RootStack.Screen name="Login" options={{headerShown: false}} component={Login} />
            <RootStack.Screen name="Register" component={Register}/>
            <RootStack.Screen name="SRS" component={SRS}/>
            <RootStack.Screen name="Camera" component={Camera}/>
            <RootStack.Screen name="OCR" component={OCR}/>
        </RootStack.Navigator>
    )
}