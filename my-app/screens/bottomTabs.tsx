import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { Home } from './home';
import { Profile } from './profile';
import {Camera} from "./camera";

const Tab = createMaterialBottomTabNavigator();

export const BottomTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            shifting={true}
            sceneAnimationEnabled={false}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: 'home-account',
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: 'bell-outline',
                }}
            />
            <Tab.Screen
                name="Camera"
                component={Camera}
                options={{
                    tabBarIcon: 'message-text-outline',
                }}
            />
        </Tab.Navigator>
    );
};