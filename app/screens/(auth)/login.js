import { useEffect, useRef, useState } from 'react';
import { Link } from "expo-router";

import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View, TextInput, Button, Text, Image, Switch, Alert, TouchableOpacity } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DefaultLayout from "../../layout/keyboardlayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { Axios, AxiosError } from 'axios';
import AuthLayout from '../../layout/authlayout';
import { useAlert } from '../../hook/usealert';
import KeyboardLayout from '../../layout/keyboardlayout';
import { Base64, decode } from 'js-base64';
import { Buffer } from 'buffer';
const API_URL = process.env.API_URL;

// 드래그 & ctrl alt l -> 자동 정렬
// 학교 하늘 색 #008FD5, 남색 #002E66

export default function Login({ navigation, route }) {
    const inputRef = useRef();
    const handleTextClick = () => {
        inputRef.current.focus();
    }
    
    const [emailPrefix, setEmailPrefix] = useState('');
    const [password, setPassword] = useState('');
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const [loginDisable, setLoginDisable] = useState(false);

    // 로그인 버튼 눌렀을 때
    const handleConfirm = () => {
        setLoginDisable(true);
        const userData = {
            username: `${emailPrefix}@mju.ac.kr`,
            password: password,
        }
        try{
        axios.post(`${API_URL}/api/login`,
        userData, { headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        }})
        //성공 핸들링
        .then(async(res) => {
            const result = res.data;
            // 비동기저장소에 토큰, 세션 정보 저장
            const token = result.data.token;
            // const decoded = Base64.fromBase64(token);
            const decoded = Buffer.from(token, 'base64').toString('ascii');
            // console.log(decoded);
            const decoded1 = decoded.split(',"userId":')[1];
            const userId = decoded1.split(',"iat"')[0];

            const refresh = result.data.refreshToken;
            // const tokenExp = new Date(new Date().getTime() + 30 * 1000); //만료 테스트 30초
            const tokenExp = new Date(new Date().getTime() + 60 * 1000 * 60 * 12); //실제 만료 12시간 - authlayout이랑 연결됨
            // const refreshExp = new Date(new Date().getTime() + 10 * 1000); //리프레시 테스트 10초
            const refreshExp = new Date(new Date().getTime() + 60 * 1000 * 60 * 5); //5시간을 만료갱신 기준으로 삼을 예정
            const loginData = {
                userId: parseInt(userId),
                token: token,
                refresh: refresh,
                session: (stayLoggedIn ? true : undefined),
                tokenExp: tokenExp.toISOString(),
                refreshExp: refreshExp.toISOString()
            }
            // console.log(loginData);
            await AsyncStorage.setItem('token', JSON.stringify(loginData));
            // Alert.alert('로그인 성공', result.data.message);
            navigation.reset({
                index: 0,
                routes: [{name: 'Root'}],
            });
            navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message: result.data.message});
        })
        //에러 핸들링
        .catch (error => {
            // const result = error.response.data;
            // console.log(result);
            // navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message: result.data});
            // navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message: error});
            // Alert.alert('로그인 실패', result.data);
            setPassword('');
        })
        .then (setLoginDisable(false))
        } catch(err) {
            // console.log(err)
        };
    }

    // 비밀번호 찾기 버튼 눌렀을 때
    const handleFindPassword = () => {
        navigation.navigate('PwFind');
        // Alert.alert('비밀번호를 찾습니다');
    }

    // 앱 둘러보기 버튼 눌렀을 때
    const handleAppTour=()=>{
        Alert.alert('보자보자')
    }

    //이메일 콘솔에 뭐라고 찍히는지 확인하기
    return (
        <AuthLayout navigation={navigation} route={route}>
        <KeyboardLayout>
            <View style={styles.container}>
                <View style={styles.container_width}>
                    <View style={styles.icon}>
                        <Image
                            style={styles.myongji_icon}
                            source={require('../../../assets/myongjicamp-title.png')} />
                    </View>
                    <View style={styles.input}>
                        <View style={styles.input_box}>
                            <TextInput
                                ref={inputRef}
                                style={styles.input_email_txt}
                                placeholder="이메일"
                                value={emailPrefix}
                                onChangeText={setEmailPrefix}
                                autoCapitalize='none'
                                maxLength={20} // @앞의 최대 글자 수 30자
                            />
                            <Text style={styles.input_email_rear}
                            onPress={handleTextClick}>@mju.ac.kr</Text>
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
                        <View style={styles.checkBox}>
                            <BouncyCheckbox
                                size={20}
                                textStyle={{
                                    textDecorationLine: "none"
                                }}
                                fillColor='#008FD5'
                                text="로그인 유지"
                                isChecked={stayLoggedIn}
                                onPress={setStayLoggedIn}
                            />
                        </View>
                    </View>
                    <View style={styles.ignore_up}></View>
                    <View style={styles.confirm}>
                        <TouchableOpacity
                            style={styles.confirm_button}
                            onPress={handleConfirm}
                            disabled={loginDisable}>
                            <Text style={styles.confirm_button_txt}>로그인</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cant}>
                        <TouchableOpacity
                            style={styles.cant_findPassword_button}
                            onPress={handleFindPassword}>
                            <Text style={styles.cant_findPassword_button_txt}>비밀번호 찾기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cant_singup_button}
                            onPress={() => navigation.navigate('Step1')}>
                            <Text style={styles.cant_singup_button_txt}>회원가입</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.app_tour}>

                        <TouchableOpacity
                            style={styles.app_tour_button}
                            onPress={handleAppTour}>
                            <Text style={styles.app_tour_button_txt}>앱 둘러보기</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.ignore_down}></View>

                </View>
            </View>
        </KeyboardLayout>
        </AuthLayout>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent : "center"
    },
    container_width: {
        width: "75%",
        height: '80%',
    },
    icon: {
        flex: 2.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    myongji_icon: {
        height: 130,
        width: 130,
    },
    input: {
        flex: 2,
        justifyContent : "space-around"
    },
    input_box: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        height: 50,
        borderRadius: 16,
        paddingHorizontal: 20,
    },
    input_email_txt: {
        flex :1,
        fontSize: 15,
    },
    input_email_rear: {
        fontSize: 15,
        color: 'gray',
    },
    input_password: {
        borderWidth: 1,
        alignItems: 'center',
        height: 50,
        borderRadius: 15,
        paddingHorizontal: 20,
        fontSize: 15
    },
    checkBox: {
        width: "40%",
        borderRadius: 20,
        justifyContent: 'flex-end',
    },
    ignore_up : {
        flex : 0.3,
    },
    confirm: {
        flex: 1,
        justifyContent:"center",
        // backgroundColor:"red"
    },
    confirm_button: {
        borderRadius: 20,
        height : 60,
        backgroundColor: "#002E66",
        justifyContent: "center",
        alignItems: "center"
    },
    confirm_button_txt:{
        fontSize : 23,
        color : "white",
    },
    cant: {
        flex: 0.5,
        flexDirection: 'row',
    },
    cant_findPassword_button :{
        flex : 0.5,
        justifyContent : "center",
        alignItems : "center"

    },
    cant_findPassword_button_txt : {
        fontSize:15,

    },
    cant_singup_button : {
        flex : 0.5,
        justifyContent : "center",
        alignItems : "center"
    },
    cant_singup_button_txt : {
        fontSize:15,
    },
    app_tour: {
        flex: 1,
        justifyContent : "center",
        alignItems : "center"
    },
    app_tour_button : {
        borderRadius: 20,
        width : "60%",
        height : 50,
        borderColor : "#002E66",
        borderWidth : 3,
        justifyContent: "center",
        alignItems: "center"
    },
    app_tour_button_txt : {
        fontSize : 18,
    },

    ignore_down : {
        flex : 1,
    }

});