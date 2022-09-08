import React from 'react';
import {
    MD3LightTheme as DefaultTheme, Provider as PaperProvider,
} from 'react-native-paper';

import { RootNavigator } from './rootNavigator';

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

export const Main = () => {
  //handle themes and languages here
    return (
            <PaperProvider theme={theme}>
                <RootNavigator />
            </PaperProvider>
    );
};