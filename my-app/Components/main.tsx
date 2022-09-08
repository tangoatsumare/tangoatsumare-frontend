import React from 'react';
import {
    Provider as PaperProvider,
} from 'react-native-paper';

import { RootNavigator } from './rootNavigator';

export const Main = () => {
  //handle themes and languages here
    return (
            <PaperProvider>
                <RootNavigator />
            </PaperProvider>
    );
};