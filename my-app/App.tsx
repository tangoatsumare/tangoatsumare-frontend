// https://callstack.github.io/react-native-paper/1.0/getting-started.html
import {NavigationContainer} from "@react-navigation/native";
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { registerRootComponent } from 'expo';
import "react-native-gesture-handler";
import React from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import {TabNav} from "./Components/tabNav";
import {StackNav} from './Components/stackNavigator';
import 'react-native-gesture-handler';

export default function App() {

    const theme = {
        ...DefaultTheme,
        roundness: 2,
        version: 3,
        colors: {
            ...DefaultTheme.colors,
            primary: '#FF4F4F',
            secondary: '#1C1C1C',
            tertiary: '#FFFFFF',
        },
    };

    return (
        <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer independent={true}>
              <StackNav />
          </NavigationContainer>
      </PaperProvider>
        </SafeAreaProvider>
    );
}

// https://docs.expo.dev/versions/latest/sdk/register-root-component/
registerRootComponent(App);
