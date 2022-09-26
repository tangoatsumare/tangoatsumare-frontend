import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from './drawerContents';
import {Home} from "../screens/home";
import {SRS} from "../screens/srs";
import {Camera} from "../screens/camera";
import { Search } from '../screens/Search';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';


const Drawer = createDrawerNavigator();

export const HomeNavigator = () => {
    const theme = useTheme();
    return (
        <Drawer.Navigator 
            useLegacyImplementation={true} 
            drawerContent={props => <DrawerContent {...props} />}
            // https://stackoverflow.com/questions/70758201/react-navigation-default-drawer-icon-how-to-change-it
            screenOptions={({ navigation }) => ({
                headerLeft: props => (
                    <TouchableOpacity
                        onPress={navigation.toggleDrawer}
                    >
                        <Icon
                            name="menu" 
                            size={40}
                            style={{paddingLeft: 20}}
                            color={theme.colors.primary}
                        />
                    </TouchableOpacity>
                ),
              })}
        >
            <Drawer.Screen 
                name="Home Screen" 
                options={{headerTitle:"Home"}} 
                component={Home} 
            />
        </Drawer.Navigator>
            );
};

export const SRSNavigator = () => {
    const theme = useTheme();
    return (
        <Drawer.Navigator 
            useLegacyImplementation={true} 
            drawerContent={props => <DrawerContent {...props} />}
            screenOptions={({ navigation }) => ({
                headerLeft: props => (
                    <TouchableOpacity
                        onPress={navigation.toggleDrawer}
                    >
                        <Icon
                            name="menu" 
                            size={40}
                            style={{paddingLeft: 20}}
                            color={theme.colors.primary}
                        />
                    </TouchableOpacity>
                ),
              })}    
        >
            <Drawer.Screen name="SRS Screen" options={{headerTitle:"Review"}} component={SRS} />
        </Drawer.Navigator>
    );
};
export const CamNavigator = () => {
    const theme = useTheme();
    return (
        <Drawer.Navigator 
            useLegacyImplementation={true} 
            drawerContent={props => <DrawerContent {...props} />}
            screenOptions={({ navigation }) => ({
                headerLeft: props => (
                    <TouchableOpacity
                        onPress={navigation.toggleDrawer}
                    >
                        <Icon
                            name="menu" 
                            size={40}
                            style={{paddingLeft: 20}}
                            color={theme.colors.primary}
                        />
                    </TouchableOpacity>
                ),
              })}
        >
            <Drawer.Screen name="Camera Screen" options={{headerTitle:"Camera"}} component={Camera} />
        </Drawer.Navigator>
    );
};