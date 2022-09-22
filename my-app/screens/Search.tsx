import { useEffect, useState } from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import { Button, Divider, Text, TextInput, Searchbar, Card, Avatar } from "react-native-paper";
import { Keyboard, Dimensions } from 'react-native';

interface SearchBarProps {
    text: string,
    setText: any,
    textInputOnFocus: boolean,
    setTextInputOnFocus: any
}

const { width } = Dimensions.get('window');

export const SearchBar = (props: SearchBarProps) => {
    const { text, setText, textInputOnFocus, setTextInputOnFocus } = props;

    const handleEditSubmit = () => {
        console.log('Hi');
    }

    return (
        <View style={{
            flex: 1,
            marginTop: 5,
            marginBottom: 5
        }}>
            <TextInput 
                style={{
                    flex: 1, 
                    // alignItems: 'center', 
                    justifyContent: 'center',
                    maxWidth: width / 2,
                    width: width / 2
                    // fontSize: 20
                }}
                mode="outlined"
                value={text}
                placeholder="search"
                onSubmitEditing={handleEditSubmit}
                onChangeText={text => setText(text)}
                onFocus={() => setTextInputOnFocus(true)}
                onBlur={() => console.log('byebye')} // trigger during blur event
                left={<TextInput.Icon icon="magnify" />}
                right={textInputOnFocus? <TextInput.Icon icon="close-circle" onPress={() => {
                    setText('');
                }}/>: null}
            />

        </View>
    );
};

export const SearchBody = (props: SearchBarProps) => {
    const { text, setText, textInputOnFocus, setTextInputOnFocus } = props;
    
    return (
        <ScrollView>
            <Text variant="headlineSmall">Tags</Text>
            <Text>when clicked, the result list is updated</Text>
            <Text>multiple clicks possible?</Text>
            <View style={{alignItems: 'flex-start'}}>
                <Button style={styles.categoryButton} mode="contained-tonal">
                    <Text variant='bodyMedium'>#cat1 
                        <Text variant='labelSmall'> {"(0)"}</Text>
                    </Text>
                </Button>
                <Button style={styles.categoryButton} mode="contained-tonal">
                <Text variant='bodyMedium'>#cat2 
                        <Text variant='labelSmall'> {"(0)"}</Text>
                    </Text>
                </Button>
                <Button style={styles.categoryButton} mode="contained-tonal">
                    <Text variant='bodyMedium'>#cat3 
                        <Text variant='labelSmall'> {"(0)"}</Text>
                    </Text>
                </Button>
            </View>
            <Divider bold={true} />
            <Text variant="headlineSmall">Results</Text>
            <Text>queried list with brief info</Text>
            <Text>when clicked, navigate to a page with verbose info</Text>
            {text && 
            <Card
                onPress={() => console.log(`${text} card clicked`)}
            >
                <Card.Title 
                    title={text} 
                    subtitle="the sentence"
                    left={(props) => <Avatar.Icon {...props} icon="folder" />}
                />
                <Card.Content>
                </Card.Content>
            </Card>
            }
        </ScrollView>

    );
}

// export const Search = () => {
//     const [text, setText] = useState('');
//     const [textInputOnFocus, setTextInputOnFocus] = useState(false);

//     return (
//         <ScrollView style={styles.container}>
//             <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
//                 <TextInput 
//                     style={{flex: 1}}
//                     mode="outlined"
//                     value={text}
//                     placeholder="word, categories, hashtags"
//                     onChangeText={text => setText(text)}
//                     onFocus={() => setTextInputOnFocus(true)}
//                     onBlur={() => console.log('byebye')} // trigger during blur event
//                     left={<TextInput.Icon icon="magnify" />}
//                     right={textInputOnFocus? <TextInput.Icon icon="close-circle" onPress={() => {
//                         setText('');
//                     }}/>: null}
//                 />
//                 {textInputOnFocus && 
//                 <Button 
//                     mode="contained-tonal" 
//                     onPress={() => {
//                         Keyboard.dismiss();
//                         setTextInputOnFocus(false);
//                     }}
//                     style={{marginLeft: 10}}
//                 >Cancel</Button>}
//             </View>
//             <Divider bold={true} />
//             <Text variant="headlineSmall">Tags</Text>
//             <Text>when clicked, the result list is updated</Text>
//             <Text>multiple clicks possible?</Text>
//             <View style={{alignItems: 'flex-start'}}>
//                 <Button style={styles.categoryButton} mode="contained-tonal">
//                     <Text variant='bodyMedium'>#cat1 
//                         <Text variant='labelSmall'> {"(0)"}</Text>
//                     </Text>
//                 </Button>
//                 <Button style={styles.categoryButton} mode="contained-tonal">
//                 <Text variant='bodyMedium'>#cat2 
//                         <Text variant='labelSmall'> {"(0)"}</Text>
//                     </Text>
//                 </Button>
//                 <Button style={styles.categoryButton} mode="contained-tonal">
//                     <Text variant='bodyMedium'>#cat3 
//                         <Text variant='labelSmall'> {"(0)"}</Text>
//                     </Text>
//                 </Button>
//             </View>
//             <Divider bold={true} />
//             <Text variant="headlineSmall">Results</Text>
//             <Text>queried list with brief info</Text>
//             <Text>when clicked, navigate to a page with verbose info</Text>
//             {text && 
//             <Card
//                 onPress={() => console.log(`${text} card clicked`)}
//             >
//                 <Card.Title 
//                     title={text} 
//                     subtitle="the sentence"
//                     left={(props) => <Avatar.Icon {...props} icon="folder" />}
//                 />
//                 <Card.Content>
//                 </Card.Content>
//             </Card>
//             }
//         </ScrollView>
//     );
// }

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    categoryButton: {
        marginBottom: 5,
        borderRadius: 30,
    }
});
