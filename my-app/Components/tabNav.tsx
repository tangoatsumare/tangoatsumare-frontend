import React from 'react';
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import { HomeStack, SRSStack, CameraStack } from "./stackNav"

export const TabNav = () => {

    const Tab = createMaterialBottomTabNavigator();

    return (
        <Tab.Navigator
            initialRouteName="Home"
            shifting={true}
            sceneAnimationEnabled={false}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    tabBarIcon: 'home-account',
                }}
            />
            <Tab.Screen
                name="SRS"
                component={SRSStack}
                options={{
                    tabBarIcon: 'card-multiple-outline',
                }}
            />
            <Tab.Screen
                name="Camera"
                component={CameraStack}
                options={{
                    tabBarIcon: 'camera',
                }}
            />
        </Tab.Navigator>
    );
};

