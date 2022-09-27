import React, { useEffect } from 'react';
import {
    MD3LightTheme as DefaultTheme, Provider as PaperProvider,
} from 'react-native-paper';
import { fontConfig } from "../library/fontConfig";
import {CamNavigator, HomeNavigator, SRSNavigator, SearchNavigator} from './rootNavigator';

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
    fonts: fontConfig // // NOT WORKING YET
};

export const HomeNav = () => {
  //handle themes and languages here
    return (
            <PaperProvider theme={theme}>
                <HomeNavigator />
            </PaperProvider>
    );
};
export const SearchNav = () => {
    //handle themes and languages here
    return (
        <PaperProvider theme={theme}>
            <SearchNavigator />
        </PaperProvider>
    );
};

export const SRSNav = () => {
    //handle themes and languages here
    return (
        <PaperProvider theme={theme}>
            <SRSNavigator />
        </PaperProvider>
    );
};
export const CamNav = () => {
    //handle themes and languages here
    return (
        <PaperProvider theme={theme}>
            <CamNavigator />
        </PaperProvider>
    );
};