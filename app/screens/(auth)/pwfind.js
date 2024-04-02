import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import KeyboardLayout from "../../layout/keyboardlayout";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function PwFind() {
    const navigation = useNavigation();
    const regex = /^[a-zA-Z0-9]+$/
    const [email, setEmail] = useState('');
    const [isPressed, setIsPressed] = useState(false);
    const handlePwFind = () => {
        if (email === '') { // 이메일 빈칸인지 아닌지 확인
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'경고', message: '이메일을 입력해주세요.'});
            // return Alert.alert('경고', '이메일을 입력해주세요.');
        }
        if (!regex.test(email)) { // 한글, 특수문자 방지
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message: '영문, 숫자만 입력 가능합니다.'});
            // return Alert.alert('경고', '영문, 숫자만 입력 가능합니다.')
        }
        try{
            setIsPressed(true);
            // const params = new URLSearchParams();
            // params.append('email', `${email}@mju.ac.kr`);
            // axios.get(`${API_URL}/api/email/password?${params.toString()}`,{})
            axios.post(`${API_URL}/api/email/password`,{email:`${email}@mju.ac.kr`},{
                headers:{'Content-Type':'application/json'}
            })
            .then(res => {
                const result = res.data;
                console.log(result);
                navigation.pop();
                navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message:'이메일로 임시 비밀번호를 전송했습니다.'});
                setIsPressed(false);
            })
            .catch(err => {
                console.log(err);
                setIsPressed(false);
            })
        } catch(err){
            console.log(err);
        }
    }
    return (
        <KeyboardLayout>
        <View style={{alignItems: 'center', justifyContent:'center'}}>
            <View style={{marginTop:hp('7%'), height:hp('25%')}}>
                <Image style={{flex:1,objectFit:'contain'}} source={require('../../../assets/myongjicamp-title.png')}/>
            </View>
            <View style={{marginTop:hp('6%'), height:hp('36%'), width:'80%', borderWidth:1, borderRadius:20, paddingVertical:hp('5%'),paddingHorizontal:hp('2%')}}>
                <Text style={{fontSize:13, marginLeft:'2.5%', marginBottom:hp('0.5%')}}>학교 이메일</Text>
                <TextInput placeholder="이메일을 입력하세요"
                    maxLength={30}
                    value={email} onChangeText={(text)=>setEmail(text)}
                    style={{backgroundColor:'lightgray', borderRadius:20, height:hp('8%'), paddingHorizontal:16}} />
                <Text style={{color:'gray', position:'relative', bottom:41, left:167}}>@mju.ac.kr</Text>
                <View style={{justifyContent:'center', alignItems:'center', marginTop:hp('3%')}}>
                    <TouchableOpacity disabled={isPressed} onPress={handlePwFind} style={{backgroundColor:'#4ea1d3', height:hp('7%'), width:'50%', justifyContent:'center', alignItems:'center', borderRadius:16}}>
                        <Text style={{color:'white'}}>비밀번호 찾기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </KeyboardLayout>
    )
} 