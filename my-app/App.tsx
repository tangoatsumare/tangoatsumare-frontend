// https://callstack.github.io/react-native-paper/1.0/getting-started.html
import { NavigationContainer } from "@react-navigation/native";
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { registerRootComponent } from 'expo';
import "react-native-gesture-handler";
import React, { useCallback, useState, useEffect } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import {TabNav} from "./Components/tabNav";
import { StackNav } from './Components/stackNavigator';
import 'react-native-gesture-handler';
import { fontConfig } from "./library/fontConfig";
import { LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import { TangoProvider } from './contexts/TangoContext';
import { AuthProvider } from './contexts/AuthContext';

LogBox.ignoreAllLogs();

SplashScreen.preventAutoHideAsync();

export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

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
    fonts: fontConfig // NOT WORKING YET
  };

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <TangoProvider>
            <NavigationContainer independent={true}>
              <StackNav />
            </NavigationContainer>
          </TangoProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

// https://docs.expo.dev/versions/latest/sdk/register-root-component/
registerRootComponent(App);
