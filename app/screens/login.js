import {useState} from 'react';
import { Link } from "expo-router";

import { KeyboardAvoidingView,Platform,StyleSheet, View,TextInput, Button,Text,Image } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function Login(){
    const [emailPrefix, setEmailPrefix] = useState('');
    const [password, setPassword] = useState('');

    return (
        <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style ={styles.container}>
            <View style ={styles.icon}>
            <Image 
            style={styles.myongji_icon}
            source={require('../../assets/myongji-icon.png')}/>
            </View>
            <View style ={styles.input}>
                <TextInput 
                style={styles.input_email}
                placeholder="이메일"
                value={emailPrefix}
                onChangeText={setEmailPrefix}
                autoCapitalize='none'
                maxLength={30} // 최대 글자 수 30자
                />
                <Text>@mju.ac.kr</Text>
                <TextInput
                placeholder="비밀번호"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                autoCapitalize='none'
                maxLength={30} // 최대 글자 수 30자
                />
            </View>
            <View style={styles.checkBox}></View>
            <View style={styles.confirm}></View>
            <View style={styles.cant}></View>
            <View style={styles.app_tour}></View>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'red',
    },
    icon : {
        flex : 3,
        backgroundColor : 'red',
        justifyContent: 'center',
        alignItems: 'center'
    },
    myongji_icon : {
        height: 100,
        width: 100
    },
    input : {
        flex : 2,
        backgroundColor : 'green'
    },
    checkBox : {
        flex : 0.5,
        backgroundColor : 'white'
    },
    confirm : {
        flex : 1.5,
        backgroundColor : 'red'
    },
    cant : {
        flex : 0.5,
        backgroundColor : 'green'
    },
    app_tour : {
        flex : 2,
        backgroundColor : 'white'
    }

});