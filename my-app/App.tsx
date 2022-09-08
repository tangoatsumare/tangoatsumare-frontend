import { StyleSheet } from 'react-native';
// https://callstack.github.io/react-native-paper/1.0/getting-started.html
import {NavigationContainer} from "@react-navigation/native";
import { Provider as PaperProvider } from 'react-native-paper';
import { registerRootComponent } from 'expo';
import { Main } from "./screens/main";
import {Routes} from "./library/routes";
import {Home} from "./screens/home";
import "react-native-gesture-handler";
import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Card} from "./screens/card";
import {Profile} from "./screens/profile";
import {Settings} from "./screens/settings";
import {Camera} from "./screens/camera";
import {BottomTabs} from "./screens/bottomTabs";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";

export default function App() {

    const Stack = createNativeStackNavigator();
    const Tab = createMaterialBottomTabNavigator();

    const HomeStack = () => {

        return (
            <Stack.Navigator  initialRouteName="Main">
                <Stack.Screen options={{headerShown: false}} name="Main" component={Main} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Card" component={Card}/>
                <Stack.Screen name="Settings" component={Settings}/>
                <Stack.Screen name="Profile" component={Profile}/>
                <Stack.Screen name="Camera" component={Camera}/>
            </Stack.Navigator>
        )
    }

    const ProfileStack = () => {

        return (
            <Stack.Navigator initialRouteName="Profile">
                <Stack.Screen name="Settings" component={Settings}/>
                <Stack.Screen name="Profile" component={Profile}/>
            </Stack.Navigator>
        )
    }

    const CameraStack = () => {

        return (
            <Stack.Navigator initialRouteName="Camera">
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Card" component={Card}/>
                <Stack.Screen name="Settings" component={Settings}/>
                <Stack.Screen name="Profile" component={Profile}/>
                <Stack.Screen name="Camera" component={Camera}/>
            </Stack.Navigator>
        )
    }

    return (
        <SafeAreaProvider>
        <PaperProvider>
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
                      name="Profile"
                      component={ProfileStack}
                      options={{
                          tabBarIcon: 'account-outline',
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
