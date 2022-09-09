import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from './drawerContents';
import {Home} from "../screens/home";
import {SRS} from "../screens/srs";
import {Camera} from "../screens/camera";


const Drawer = createDrawerNavigator();

export const HomeNavigator = () => {
    return (
        <Drawer.Navigator useLegacyImplementation={true} drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="Home Screen" options={{headerTitle:"Home"}} component={Home} />
        </Drawer.Navigator>
            );
};
export const SRSNavigator = () => {
    return (
        <Drawer.Navigator useLegacyImplementation={true} drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="SRS Screen" options={{headerTitle:"SRS"}} component={SRS} />
        </Drawer.Navigator>
    );
};
export const CamNavigator = () => {
    return (
        <Drawer.Navigator useLegacyImplementation={true} drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="Camera Screen" options={{headerTitle:"Camera"}} component={Camera} />
        </Drawer.Navigator>
    );
};