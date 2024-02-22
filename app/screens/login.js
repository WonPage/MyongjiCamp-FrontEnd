import {useState} from 'react';
import { Link } from "expo-router";

import { KeyboardAvoidingView,Platform,StyleSheet, View,TextInput, Button,Text,Image,Switch } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
// 드래그 & ctrl alt l -> 자동 정렬
// navigation.navigate('Step1'); -> 회원가입 

export default function Login({navigation}){
    const [emailPrefix, setEmailPrefix] = useState('');
    const [password, setPassword] = useState('');
    const [stayLoggedIn, setStayLoggedIn] = useState(false);

    return (
        <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style ={styles.container}>
            <View style = {styles.con}>
            <View style ={styles.icon}>
            <Image 
            style={styles.myongji_icon}
            source={require('../../assets/myongji-icon.png')}/>
            </View>
            <View style ={styles.input}>
                <View style = {styles.input_box}>
                    <TextInput 
                    style={styles.input_email_txt}
                    placeholder="이메일"
                    value={emailPrefix}
                    onChangeText={setEmailPrefix}
                    autoCapitalize='none'
                    maxLength={20} // @앞의 최대 글자 수 30자
                    />
                    <Text style={styles.input_email_rear}>@mju.ac.kr</Text>
                </View>
                <TextInput
                style={styles.input_password}
                placeholder="비밀번호"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                autoCapitalize='none'
                maxLength={20} // 최대 글자 수 30자
                />
            </View>
            <View style={styles.checkBox_container}>
                <View style={styles.checkBox}>
                    <View style={styles.ex}>
                    <BouncyCheckbox
                    size={20}
                    textStyle={{
                        textDecorationLine : "none"
                    }}
                    text="로그인 유지"
                    />
                    </View>
                </View>
            </View>
            <View style={styles.confirm_container}>
                <Button
                style = {styles.confirm}
                title = "로그인"
                />
            </View>
            <View style={styles.cant}>
                <Button
                title = "회원가입"
                onPress={()=>navigation.navigate('Step1')}
                />
            </View>
            <View style={styles.app_tour}></View>
            </View>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems:"center",
    },
    con : {
        flex:1,
        width : "80%",
    },
    icon : {
        flex : 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    myongji_icon : {
        height: 100,
        width: 100
    },
    input : {
        flex : 2.5,
    },
    input_box : {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent:'space-around',
        borderWidth: 1,
        height : 40,
        marginVertical : 10,
        borderRadius:15,
        paddingHorizontal : 10,
    },
    input_email_txt : {
        fontSize : 15,
    },
    input_email_rear : {
        fontSize : 15,
        color : 'gray',
        width : '40%',
    },
    input_password : {
        borderWidth: 1,
        alignItems : 'center',
        height : 40,
        borderRadius:15,
        paddingHorizontal : 10,
        fontSize : 15
    },
    checkBox_container : {
        flex : 0.5,
    },
    checkBox : {
        borderRadius : 20,

    },
    confirm_container : {
        flex : 1.5,
        backgroundColor : 'red'
    },
    confirm:{
        backgroundColor:"#1e90ff",
        borderRadius : 20
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