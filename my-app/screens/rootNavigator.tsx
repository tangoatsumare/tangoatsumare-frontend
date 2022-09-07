import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from './drawerContents';
import {Home} from "./home";
import {useNavigation} from "@react-navigation/core";
import {StackNavigationProp} from "@react-navigation/stack";
import {ParamListBase} from "@react-navigation/native";


const Drawer = createDrawerNavigator();

function HomeScreen() {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
                onPress={()=>{
                    navigation.navigate("Card")
                }}>
                <Text>to card</Text>
            </TouchableOpacity>
        </View>
    );
}

export const RootNavigator = () => {
    return (
        <Drawer.Navigator useLegacyImplementation={true} drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="Home" component={HomeScreen} />
        </Drawer.Navigator>
    );
};