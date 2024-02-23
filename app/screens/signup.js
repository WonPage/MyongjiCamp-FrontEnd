import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Text, StyleSheet, View, Image, TextInput, Alert, Pressable, Keyboard, TouchableWithoutFeedback } from "react-native";

const Stack = createNativeStackNavigator();

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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Image
                    style={styles.myongji_icon}
                    source={require('../../assets/myongji-icon.png')} />

                <Text style={styles.email_text}>학교 인증을 완료해주세요.</Text>
                <View style={styles.email_box}>
                    <TextInput
                        ref={inputRef}
                        style={styles.email_value}
                        placeholder="이메일"
                        placeholderTextColor={"gray"}
                        value={email}
                        onChangeText={setEmail}
                        maxLength={30} />
                    <Text
                        style={styles.email_example}
                        onPress={handleTextClick}
                    >@mju.ac.kr</Text>
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
                    (<Pressable
                        style={styles.email_send_button}
                        onPress={handleCodeSend}><Text>인증번호 보내기</Text>
                    </Pressable>)}
                <View style={styles.blank}></View>
            </View>
        </TouchableWithoutFeedback>
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
            email : email,
            password : password,
        });
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Image
                    style={styles.myongji_icon}
                    source={require('../../assets/myongji-icon.png')} />
                <Text>안전한 비밀번호를 만들어주세요.</Text>
                <TextInput style={styles.password_box}
                placeholder="비밀번호 입력"
                onChangeText={setPassword} />
                <TextInput style={styles.password_box}
                placeholder="비밀번호 재입력"
                onChangeText={setPasswordCheck}/>
                <Pressable
                    onPress={handlePasswordCheck}><Text>확인</Text>
                </Pressable>
            </View>
        </TouchableWithoutFeedback>
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Image
                    style={styles.myongji_icon}
                    source={require('../../assets/myongji-icon.png')} />
                <View style={styles.nickname_box}>
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
                <Pressable
                style={styles.signup_button}
                onPress={handleSignupComplete}>
                    <Text>회원가입 완료</Text>
                </Pressable>
            </View>
        </TouchableWithoutFeedback>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 40,
    },
    text: {
        fontSize: 28,
    },
    myongji_icon: {
        flex: 1.2,
        justifyContent: "center",
        alignItems: "center",
        resizeMode: "contain",
        // backgroundColor: 'pink'
    },
    email_text: {
        flex: 0.4,
        fontSize: 18,
        // backgroundColor: 'green',
    },
    email_box: {
        flex:0.3, 
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 20,
    },
    email_value: {
        flex: 1,
    },
    email_example: {
        color: 'gray'
    },
    email_send_button: {
        width: 130,
        height: 50,
        borderRadius: 20,
        backgroundColor: "skyblue",
        marginTop: 40,
        justifyContent: "center",
        alignItems: 'center',
    },
    password_box: {
        borderWidth: 1,
    },
    nickname_box: {
        flexDirection: 'row',
        borderWidth: 1,
    },
    nickname_check: {
        margin: 5,
        backgroundColor: "skyblue",
    },
    signup_button: {
        backgroundColor: "yellow"
    },
    blank:{
        flex: 0.8,  
        // backgroundColor: "red",
    }
});