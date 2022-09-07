import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default function Button(button: {title: string, onPress: string, icon: string, color: string}) {
    console.log("button test");
    return (
        <TouchableOpacity>
            <Entypo name={button.icon} size={28} color={button.color ? button.color : '#f1f1f1'} />
        </TouchableOpacity>
    );
}