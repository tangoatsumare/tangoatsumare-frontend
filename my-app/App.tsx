import { StyleSheet } from 'react-native';
// https://callstack.github.io/react-native-paper/1.0/getting-started.html
import {NavigationContainer} from "@react-navigation/native";
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { registerRootComponent } from 'expo';
import { Main } from "./Components/main";
import {Routes} from "./library/routes";
import {Home} from "./screens/home";
import "react-native-gesture-handler";
import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Card} from "./Components/card";
import {Profile} from "./screens/profile";
import {Settings} from "./screens/settings";
import {Camera} from "./screens/camera";
import {SRS} from "./screens/srs";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import {Login} from "./screens/login";
import {Register} from "./screens/register";

export default function App() {

    const theme = {
        ...DefaultTheme,
        roundness: 2,
        version: 3,
        colors: {
            ...DefaultTheme.colors,
            primary: '#be1e2d',
            secondary: '#f1c40f',
            tertiary: '#a1b2c3'
        },
    };

    const Stack = createNativeStackNavigator();
    const Tab = createMaterialBottomTabNavigator();

    const HomeStack = () => {

        return (
            <Stack.Navigator  initialRouteName="Main">
                <Stack.Screen options={{headerShown: false}} name="Main" component={Main} />
                <Stack.Screen name="Settings" component={Settings}/>
                <Stack.Screen name="Profile" component={Profile}/>
                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Register" component={Register}/>
            </Stack.Navigator>
        )
    }

    const SRSStack = () => {

        return (
            <Stack.Navigator initialRouteName="SRS">
                <Stack.Screen name="SRS" component={SRS}/>
            </Stack.Navigator>
        )
    }

    const CameraStack = () => {

        return (
            <Stack.Navigator initialRouteName="Camera">
                <Stack.Screen name="Camera" component={Camera}/>
                <Stack.Screen name="Settings" component={Settings}/>
            </Stack.Navigator>
        )
    }

    return (
        <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer independent={true}>
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
          </NavigationContainer>
      </PaperProvider>
        </SafeAreaProvider>
    );
}

// https://docs.expo.dev/versions/latest/sdk/register-root-component/
registerRootComponent(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
