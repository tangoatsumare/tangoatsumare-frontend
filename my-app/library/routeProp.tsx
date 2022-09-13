
import { RouteProp } from '@react-navigation/native';

export type StackParamsList = {
    Card: {
      id: string;
    };
};

export type ScreenRouteProp = RouteProp<StackParamsList, 'Card'>;


