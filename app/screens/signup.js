import { Link, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Text, StyleSheet, View, Image, TextInput, Button, Alert, Pressable, Keyboard, TouchableWithoutFeedback } from "react-native";

export default function Signup(){
    const inputRef = useRef();

    const regex = /^[a-zA-Z0-9]+$/
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isCodeSent, SetIsCodeSent] = useState(false);

    const handleTextClick = () => {
        inputRef.current.focus();
    }

    const handleSendCode = () => {
        console.log('hi');
        if (email === ''){ // 이메일 빈칸인지 아닌지 확인
            Alert.alert('경고', '이메일을 입력해주세요.');
            return;
        }
        if (!regex.test(email)){ // 한글, 특수문자 방지
            Alert.alert('경고', '영문, 숫자만 입력 가능합니다.')
            return;
        }
        SetIsCodeSent(true);
    }

    return (
        <View style={styles.container}>
                <Image 
                style={styles.myongji_icon}
                source={require('../../assets/myongji-icon.png')}/>

                <Text>학교 인증을 완료해주세요.</Text>

                <View style={styles.email_box}>
                    <TextInput
                    ref={inputRef}
                    style={styles.email_value}
                    placeholder="이메일"
                    placeholderTextColor={"gray"}
                    value={email}
                    onChangeText={setEmail} 
                    maxLength={30}/>
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
                placeholder="인증코드"/>
                <Button title="재전송" onPress={handleResendCode} />
                <Button title="확인" onPress={handleVerifyCode} />
                </View>) :
                (<Button title="인증번호 보내기" onPress={()=>{handleSendCode}}/>)}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 28,
    },
    myongji_icon:{
        height: 100,
        width: 100
    },
    email_box:{
        flexDirection: 'row', 
        alignItems: 'center',
        borderWidth: 1,
    },
    email_value:{
        flex: 1,
    },
    email_example:{
        color:'gray'
    }
});