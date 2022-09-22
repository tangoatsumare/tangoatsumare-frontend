import React, { useEffect } from 'react';
import {
    MD3LightTheme as DefaultTheme, Provider as PaperProvider,
} from 'react-native-paper';

import {CamNavigator, HomeNavigator, SRSNavigator, SearchNavigator} from './rootNavigator';

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