import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react"
import { Alert } from "react-native";

export default function AuthLayout({children, navigation, route}) {
    const authCheck = async() => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        // console.log(token);
        if (route.name === "Login") {
            if (token?.session) {
                console.log('AuthLayout : 세션이 존재합니다.');
                navigation.navigate('Root', {token: token.token});
            } else {
                console.log('AuthLayout : 세션이 존재하지 않습니다.');
            }
        } else {
            if (token?.token) {
                // console.log('AuthLayout : 토큰 체크 완료.');
            } else {
                console.log('AuthLayer : 토큰이 만료되었습니다.');
                AsyncStorage.clear();
                navigation.navigate('Login');
                Alert.alert('경고', '토큰이 만료되었습니다. 다시 로그인해주세요.');
            }
        }
    }

    useEffect(()=>{
        authCheck();
    },[])

    return (
        <>
        {children}
        </>
    )
}