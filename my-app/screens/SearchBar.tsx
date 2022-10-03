import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native'
import { Text, TextInput as PaperTextInput} from "react-native-paper";
import { Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTangoContext } from '../contexts/TangoContext';

const { width } = Dimensions.get('window');

export const SearchBar = () => {
    const { text } = useTangoContext();
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const theme = useTheme();

    const navigateToSearchScreen = () => {
        navigation.navigate("Search");
    };

    return (
        <TouchableOpacity 
            style={{
                flexDirection: 'row',
                justifyContent: "space-evenly",
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderColor: 'rgba(0,0,0,0.1)',
                borderWidth: 0,
                borderRadius: 30,
                width: width / 1.5, // ratio that the search bar takes up the page
                height: 30
            }}
            onPress={navigateToSearchScreen}
            activeOpacity={1}
        >
            <PaperTextInput.Icon 
                icon="magnify" 
                iconColor={"rgba(0,0,0,0.5)"}
                style={{
                    marginLeft: 20 // hard coded
                }}
                />
            <Text
                style={{
                    flex: 1, 
                    marginLeft: 40,
                    marginRight: 40,
                    alignSelf: 'center',
                    width: "auto",
                    fontSize:  15
                }}
                
            >{text? text: "Search Tango"}</Text>
        </TouchableOpacity>
    );
};