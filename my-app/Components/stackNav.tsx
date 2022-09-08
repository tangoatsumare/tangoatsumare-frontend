import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Main} from "./main";
import {Settings} from "../screens/settings";
import {Profile} from "../screens/profile";
import {Login} from "../screens/login";
import {Register} from "../screens/register";
import {SRS} from "../screens/srs";
import {Camera} from "../screens/camera";
import React from "react";


const Stack = createNativeStackNavigator();

export const HomeStack = () => {

    return (
        <Stack.Navigator  initialRouteName="Main">
            <Stack.Screen options={{headerShown: false}} name="Main" component={Main} />
            <Stack.Screen name="Settings" component={Settings}/>
            <Stack.Screen name="Profile" component={Profile}/>
            <Stack.Screen name="Login" component={Login} options={{}} />
            <Stack.Screen name="Register" component={Register}/>
        </Stack.Navigator>
    )
}

export const SRSStack = () => {

    return (
        <Stack.Navigator initialRouteName="SRS">
            <Stack.Screen name="SRS" component={SRS}/>
        </Stack.Navigator>
    )
}

export const CameraStack = () => {

    return (
        <Stack.Navigator initialRouteName="Camera">
            <Stack.Screen name="Camera" component={Camera}/>
            <Stack.Screen name="Settings" component={Settings}/>
        </Stack.Navigator>
    )
}