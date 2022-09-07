import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from './drawerContents';
import {Home} from "./home";


const Drawer = createDrawerNavigator();

export const RootNavigator = () => {
    return (
        <Drawer.Navigator useLegacyImplementation={true} drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="Home" component={Home} />
        </Drawer.Navigator>
            );
};