import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Text, StyleSheet, View, Image, TextInput, Alert, Pressable, Keyboard, TouchableWithoutFeedback } from "react-native";

const Stack = createNativeStackNavigator();

export default function Signup() {
    return (
        <View></View>
    )
}

export function Step1Screen({navigation}) {
    const inputRef = useRef();

    const regex = /^[a-zA-Z0-9]+$/
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isCodeSent, SetIsCodeSent] = useState(false);
    const [step, setStep] = useState(0);

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
        SetIsCodeSent(true);
    }
    const handleResendCode = () => {
        //이메일 인증번호 재전송 코드
    }
    const handleVerifyCode = () => {
        //인증번호 인증하기 버튼
        navigation.navigate('Step2');
    }
    return (
        <View style={styles.container}>
            <Image
                style={styles.myongji_icon}
                source={require('../../assets/myongji-icon.png')} />

            <Text>학교 인증을 완료해주세요.</Text>
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
                    onPress={handleCodeSend}><Text>인증 보내기</Text>
                </Pressable>)}
        </View>
    )
}
export function Step2Screen({ navigation }) {
    return (
        <View>
            <Pressable
                onPress={()=>{navigation.navigate('Step3')}}><Text>인증 보내기</Text>
            </Pressable>
        </View>
    )
}
export function Step3Screen() {
    return (
        <View><Text>안녕하신가3</Text></View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 28,
    },
    myongji_icon: {
        height: 100,
        width: 100
    },
    email_box: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
    },
    email_value: {
        flex: 1,
    },
    email_example: {
        color: 'gray'
    },
    email_send_button: {
        borderWidth: 1,
        backgroundColor: "skyblue",
        marginTop: 20,
    }
});