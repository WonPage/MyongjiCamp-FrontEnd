import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Base64 } from "js-base64";
import { useEffect } from "react"
import { Alert } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
export default function AuthLayout({children, navigation, route}) {
    const authCheck = async() => {
        // AsyncStorage.clear();
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        // console.log(token);
        if (route.name === "Login") {
            // 1. 세션이 존재하지 않음
            if (token?.session === undefined) {
                console.log('AuthLayout : 세션이 존재하지 않습니다.');
                navigation.navigate('Login');
            }
            // 2. 세션이 존재하고 만료일이 지나지않음
            else if (token?.session && new Date(token.refreshExp) > new Date() && new Date(token.tokenExp) > new Date()) {
                console.log('AuthLayout : 세션이 존재합니다.');
                navigation.reset({
                    index:0,
                    routes:[{name:'Root'}],
                });
            }
            // 3. 세션이 존재하고 만료일이 얼마 남지않음. Refresh
            else if (new Date(token.refreshExp)<= new Date() && new Date(token.tokenExp) > new Date()){
                console.log('AuthLayout : 토큰이 만료되기 전입니다. 토큰을 재요청합니다.');
                axios.post(`${API_URL}/api/refresh`, {}, {
                    headers: {
                        'Content-Type':'application/json',
                        Authorization: `Bearer ${token.refresh}`
                    }
                })
                .then(async(res) => {
                    const decoded = Base64.decode(token);
                    const decoded1 = decoded.split(',"userId":')[1];
                    const userId = decoded1.split(',"iat"')[0];
                    const result = res.data.data;
                    const tokenExp = new Date(new Date().getTime() + 60 * 1000 * 60 * 12); //실제 만료 24시간 - login이랑 연결됨
                    const refreshExp = new Date(new Date().getTime() + 60 * 1000 * 60 * 5); //20시간을 만료갱신 기준으로 삼을 예정
                    const tokenData = {
                        userId: parseInt(userId), 
                        token: result.token,
                        refresh: result.refreshToken,
                        session: true,
                        tokenExp: tokenExp.toISOString(),
                        refreshExp: refreshExp.toISOString()
                    }
                    console.log('AuthLayout Refresh :', result.message);
                    await AsyncStorage.setItem('token', JSON.stringify(tokenData));
                    navigation.reset({
                        index:0,
                        routes:[{name:'Root'}],
                    });
                })
                .catch(err=>{
                    console.log(err);
                })
            }
            // 4. 세션이 존재하고 만료일이 지남
            else {
                console.log('AuthLayout : 토큰이 만료되었습니다. 다시 로그인해주세요.')
                AsyncStorage.clear();
                navigation.navigate('Login');
                // navigation.navigate('ModalLayout', {component: 'MyAlert', title: '안내', message: '토큰이 만료되었습니다. 다시 로그인해주세요.'})
            }
        } else {
            if (token?.token) {
                console.log('AuthLayout : 토큰 체크 완료.');
            } else {
                console.log('AuthLayout : 토큰이 만료되었습니다. 다시 로그인해주세요.')
                AsyncStorage.clear();
                navigation.navigate('Login');
                // navigation.navigate('ModalLayout', {component: 'MyAlert', title: '안내', message: '토큰이 만료되었습니다. 다시 로그인해주세요.'})
            }
        }
    }
    useEffect(()=>{
        authCheck();
    },[]);
    

    return (
        <>
        {children}
        </>
    )
}