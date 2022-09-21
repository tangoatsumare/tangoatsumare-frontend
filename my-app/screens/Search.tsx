import { useEffect, useState } from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import { Button, Divider, Text, TextInput, Searchbar } from "react-native-paper";
import { Keyboard } from 'react-native';

export const Search = () => {
    const [text, setText] = useState('');
    const [textInputOnFocus, setTextInputOnFocus] = useState(false);

    // const [searchQuery, setSearchQuery] = useState('');
    // const onChangeSearch = (query) => setSearchQuery(query);

    return (
        <ScrollView style={styles.container}>
            {/* <Text>Search bar (reactive?)</Text> */}
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <TextInput 
                    style={{flex: 1}}
                    mode="outlined"
                    value={text}
                    placeholder="word, categories, hashtags"
                    onChangeText={text => setText(text)}
                    onFocus={() => setTextInputOnFocus(true)}
                    onBlur={() => console.log('byebye')} // trigger during blur event
                    left={<TextInput.Icon icon="magnify" />}
                    right={textInputOnFocus? <TextInput.Icon icon="close-circle" onPress={() => {
                        setText('');
                    }}/>: null}
                />
                {textInputOnFocus && 
                <Button 
                    mode="contained" 
                    onPress={() => {
                        Keyboard.dismiss();
                        setTextInputOnFocus(false);
                    }}
                >Cancel</Button>}
            </View>
            <Divider bold={true} />
            <Text>Categories (checkable)</Text>
            <View style={{alignItems: 'flex-start'}}>
                <Button style={styles.categoryButton} mode="contained-tonal">cat1</Button>
                <Button style={styles.categoryButton} mode="contained-tonal">cat2</Button>
                <Button style={styles.categoryButton} mode="contained-tonal">cat3</Button>
            </View>
            <Divider bold={true} />
            <Text>Results (clickable)</Text>
            <Text>{text}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    categoryButton: {
        marginBottom: 5,
        borderRadius: 30
    }
});
