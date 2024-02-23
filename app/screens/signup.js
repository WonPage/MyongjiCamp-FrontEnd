import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Text, StyleSheet, View, Image, TextInput, Alert, Pressable, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Dimensions, Platform } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import DefaultLayout from "../layout/defaultlayout";

const Stack = createNativeStackNavigator();
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function Step1Screen({navigation}) {
    const inputRef = useRef();

    const regex = /^[a-zA-Z0-9]+$/
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isCodeSent, SetIsCodeSent] = useState(false);

    const handleTextClick = () => {
        inputRef.current.focus();
    }
    const handleCodeSend = () => {
        if (email === '') { // 이메일 빈칸인지 아닌지 확인
            return Alert.alert('경고', '이메일을 입력해주세요.');
        }
        if (!regex.test(email)) { // 한글, 특수문자 방지
            return Alert.alert('경고', '영문, 숫자만 입력 가능합니다.')
        }
        // **백엔드** 인증코드 보내기
        //성공 시
        SetIsCodeSent(true);
        //실패 시
        //return Alert.alert('오류', '전송에 실패하였습니다.');
    }
    const handleResendCode = () => {
        //이메일 인증번호 재전송 코드
    }
    const handleVerifyCode = () => {
        //인증번호 인증하기 버튼
        navigation.navigate('Step2', {
            email: email, 
        });
    }
    return (
        <DefaultLayout>
            <View style={styles.container}>
                <StatusBar style='auto' />
                <View style={styles.top_blank}></View>
                <View style={styles.icon_container}>
                    <Image
                        style={styles.myongji_icon}
                        source={require('../../assets/myongji-icon.png')} />
                </View>
                <View style={styles.text_container}>
                    <Text style={styles.text}>학교 인증을 완료해주세요.</Text>
                </View>
                <View style={styles.email_container}>
                    <View style={styles.email_box}>
                        <TextInput
                            ref={inputRef}
                            style={styles.email_value}
                            placeholder="이메일"
                            placeholderTextColor={"gray"}
                            value={email}
                            onChangeText={setEmail}
                            maxLength={30}
                            onSubmitEditing={handleCodeSend} />
                        <Text
                            style={styles.email_example}
                            onPress={handleTextClick}
                        >@mju.ac.kr</Text>
                    </View>
                </View>

                {isCodeSent ?
                    (<View>
                        <TextInput
                            onChangeText={setCode}
                            value={code}
                            placeholder="인증코드" />
                        <Pressable onPress={handleResendCode}><Text>재전송</Text></Pressable>
                        <Pressable onPress={handleVerifyCode}><Text>확인</Text></Pressable>
                    </View>) :
                    (<View style={styles.button_container}>
                        <Pressable
                            style={styles.email_send_button}
                            onPress={handleCodeSend}><Text style={styles.send_button_text}>인증번호 보내기</Text>
                        </Pressable>
                    </View>)}
                <View style={styles.buttom_blank}></View>
            </View>
        </DefaultLayout>
    )
}
export function Step2Screen({ route, navigation }) {
    const { email } = route.params;

    const passwordRegExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*&])(?=.*[0-9]).{8,20}$/; //안전 비밀번호 정규식
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const handlePasswordCheck = () => {
        if (password.length === 0) {
            return Alert.alert('경고', '비밀번호를 입력해주세요.');
        } else if (!passwordRegExp.test(password)) {
            return Alert.alert('경고', '안전하지 않은 비밀번호입니다.')
        } else if (passwordCheck.length === 0) {
            return Alert.alert('경고', '비밀번호 재입력을 입력해주세요.')
        } else if (password !== passwordCheck) {
            return Alert.alert('경고', '동일한 비밀번호를 입력해주세요.')
        }
        // 모든 검증을 마쳤으면 비밀번호를 저장 (**백엔드**) 하고 다음단계로 이동.
        navigation.navigate('Step3', {
            email: email,
            password: password,
        });
    }
    return (
        <DefaultLayout>
            <View style={styles.container}>
                <StatusBar style="auto"/>
                <View style={styles.top_blank}></View>
                <View style={styles.icon_container}>
                    <Image
                        style={styles.myongji_icon}
                        source={require('../../assets/myongji-icon.png')} />
                </View>
                <View style={styles.text_container}>
                    <Text style={styles.text}>안전한 비밀번호를 만들어주세요.</Text>
                </View>
                <View style={styles.password_container}>
                    <TextInput style={styles.password_input}
                        placeholder="비밀번호 입력"
                        onChangeText={setPassword} />
                    <TextInput style={styles.password_input}
                        placeholder="비밀번호 재입력"
                        onChangeText={setPasswordCheck} />
                </View>
                <View style={styles.password_button_container}>
                  <Pressable
                    style={styles.password_button}
                    onPress={handlePasswordCheck}><Text style={styles.password_button_text}>확인</Text>
                </Pressable>   
                </View>
                <View style={styles.buttom_blank}></View>
            </View>
        </DefaultLayout>
    )
}
export function Step3Screen({route, navigation}) {
    const { email, password } = route.params;

    const [ nickname, setNickname ] = useState('');

    const handleNicknameCheck = () => {
        // **백엔드** 닉네임 DB에 중복확인
        // 중복 시
        // return Alert.alert('경고', '이미 존재하는 닉네임입니다.');
        // 중복 안하면
        // 사용가능한 닉네임입니다. 하면서 닉네임 변경하지 않는 한 비활성화처리.
    }
    const handleSignupComplete = () => {
        // 중복확인이 true가 되면 DB에 지금까지의 이메일, PW, 닉네임을 넘기고 회원가입 완료.. => 홈 화면으로 이동
        console.log(email, password, nickname);
        // navigation.navigate('Login');
        // 중복확인이 false 상태면 '닉네임 중복검사를 해주세요.' 라는 Alert 띄움.
    }
    return (
        <DefaultLayout>
            <View style={styles.container}>
                <StatusBar style="auto"/>
                <View style={styles.top_blank}></View>
                <View style={styles.icon_container}>
                    <Image
                    style={styles.myongji_icon}
                    source={require('../../assets/myongji-icon.png')} />
                </View>
                <View style={styles.nickname_container}>
                    <TextInput
                        style={styles.nickname_input}
                        placeholder="닉네임" 
                        onChangeText={setNickname}/>
                    <Pressable
                        style={styles.nickname_check}
                        onPress={handleNicknameCheck}>
                        <Text>중복확인</Text>
                    </Pressable>
                </View>
                <View style={styles.signup_button_container}>
                    <Pressable
                        style={styles.signup_button}
                        onPress={handleSignupComplete}>
                        <Text style={styles.signup_button_text}>회원가입 완료</Text>
                    </Pressable>
                </View>
                <View style={styles.buttom_blank}></View>
            </View>
        </DefaultLayout>
    )
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'stretch',
        marginHorizontal: 40,
        // backgroundColor: 'red'
    },
    icon_container:{flex: 8, justifyContent: "center", alignItems: "center"},
    text_container: {flex: 3, justifyContent: 'center', alignItems: 'center'},
    email_container: {flex:6, justifyContent: 'center', alignItems: 'center'},
    button_container: {flex: 3, justifyContent: 'center', alignItems: 'center'},
    top_blank:{flex: 5,},
    buttom_blank:{flex: 8,},
    myongji_icon: {},
    text: {fontSize: 18},
    email_box: { 
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 20,
    },
    email_value: {flex: 1},
    email_example: {color: 'gray'},
    email_send_button: {
        width: 140,
        height: 50,
        borderRadius: 30,
        backgroundColor: "#0D47A1",
        justifyContent: "center",
        alignItems: 'center',
    },
    send_button_text:{
        color: 'white'
    },
    password_container: {
    },
    password_input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 16,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    password_button_container:{
        flex: 1,
        alignItems: 'center'
    },
    password_button:{
        width: 140,
        height: 50,
        borderRadius: 30,
        backgroundColor: "#0D47A1",
        justifyContent: "center",
        alignItems: 'center',
    },
    password_button_text:{
        color: 'white',
    },
    nickname_container: {
        flex: 2,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    nickname_input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 16,
    },
    nickname_check: {
        margin: 5,
        backgroundColor: "skyblue",
    },
    signup_button_container: {
        flex: 1,
        alignItems: 'center'
    },
    signup_button: {
        width: 140,
        height: 50,
        borderRadius: 30,
        backgroundColor: "#0D47A1",
        justifyContent: "center",
        alignItems: 'center',
    },
    signup_button_text: {
        color: 'white',
    }

});