import { useState } from 'react';
import { Link } from "expo-router";

import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View, TextInput, Button, Text, Image, Switch, Alert, TouchableOpacity } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DefaultLayout from "../../layout/defaultlayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
// 드래그 & ctrl alt l -> 자동 정렬
// 학교 하늘 색 #008FD5, 남색 #002E66

export default function Login({ navigation }) {
    const [emailPrefix, setEmailPrefix] = useState('');
    const [password, setPassword] = useState('');
    const [stayLoggedIn, setStayLoggedIn] = useState(false);

    // 로그인 버튼 눌렀을 때
    const handleConfirm = async () => {
        const fullEmail = `${emailPrefix}@mju.ac.kr`;
                 try{
                    const response = await fetch(`${process.env.API_URL}/api/login`,{
                        method: 'POST',
                        headers: {
                            'Content-Type' : 'application/json'
                        },
                        body : JSON.stringify({username:fullEmail, password: password}),
                    });
                    const result = await response.json(); //백으로 받은 json 응답
        
                    
                     if (result.ok) {
                         if (stayLoggedIn) {
                             console.log(JSON.stringify({ username: fullEmail, password: password }))

                             await AsyncStorage.setItem('key', JSON.stringify({ username: fullEmail, password: password }));
                         }
                         Alert.alert('로그인 성공', '나 확인용(지울거)');
                         // 메인 화면 열어야 됨
                     }
                     else {
                         Alert.alert('로그인 실패', result.data);
                         setPassword('');
                    }
                    
                    
                    


                }
                catch(error){
                    Alert.alert('오류','네트워크 오류가 발생하였습니다.');
                }; 
    }

    // 비밀번호 찾기 버튼 눌렀을 때

    const handleFindPassword = () => {
        Alert.alert('비밀번호를 찾습니다');
    }

    // 앱 둘러보기 버튼 눌렀을 때
    const handleAppTour=()=>{
        Alert.alert('보자보자')
    }

    //이메일 콘솔에 뭐라고 찍히는지 확인하기
    return (
        <DefaultLayout>
            <View style={styles.container}>
                <View style={styles.container_width}>
                    <View style={styles.icon}>
                        <Image
                            style={styles.myongji_icon}
                            source={require('../../../assets/myongji-icon.png')} />
                    </View>
                    <View style={styles.input}>
                        <View style={styles.input_box}>
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
                        <View style={styles.checkBox}>
                            <BouncyCheckbox
                                size={20}
                                textStyle={{
                                    textDecorationLine: "none"
                                }}
                                fillColor='#008FD5'
                                text="로그인 유지"
                                onPress={setStayLoggedIn}
                            />
                        </View>
                    </View>
                    <View style={styles.ignore_up}></View>
                    <View style={styles.confirm}>
                        <TouchableOpacity
                            style={styles.confirm_button}
                            onPress={handleConfirm}>
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
        </DefaultLayout>
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
        backgroundColor:"red"
    }

});