import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default function Button(button: {title: string, onPress: string, icon: string, color: string}) {
    console.log("button test");
    return (
        <TouchableOpacity onPress={() => console.log('camera button')} style={styles.button}>
            <Entypo name={button.icon} size={28} color={button.color ? button.color : '#f1f1f1'} />
            <Text style={styles.text}>Test</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'yellow',
        marginLeft: 10
    }
})