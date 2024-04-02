import { Text, TouchableOpacity, View } from "react-native";
import AuthLayout from "../../layout/authlayout";
import { useNavigation, useRoute } from "@react-navigation/native";
import KeyboardLayout from "../../layout/keyboardlayout";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Image } from "react-native";
import { TextInput } from "react-native";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function PwChange(){
    const navigation = useNavigation();
    const route = useRoute();
    const [isPressed, setIsPressed] = useState(false);
    const [currentPw, setCurrentPw] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [newPw, setNewPw] = useState('');
    const [newPwCheck, setNewPwCheck] = useState('');
    const [isWrong, setIsWrong] = useState(false);
    const handlePwCheck = async() => {
        if (currentPw.length === 0) {
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message:'비밀번호를 입력해주세요.'});
        }
        try{
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            axios.post(`${API_URL}/api/auth/password/verify`, {password:currentPw}, {
                headers:{"Content-Type":'application/json', Authorization: `Bearer ${token.token}`}
            })
            .then(res => {
                const result = res.data;
                if (result.status === 500){
                    navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message:result.data});
                    return setIsChecked(false);
                }
                navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message:result.data});
                setIsChecked(true);
            })
        }catch{
            // console.log;
        }
    }
    const handlePwChange = async() => {
        const passwordRegExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*&])(?=.*[0-9]).{8,20}$/; //안전 비밀번호 정규식
        if (newPw.length === 0) {
            setIsWrong(true);
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'경고', message: '비밀번호를 입력해주세요.'});
        } else if (!passwordRegExp.test(newPw)) {
            setIsWrong(true);
            setNewPw('');
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'경고', message: '안전하지 않은 비밀번호입니다.\n\n영문, 숫자, 특수문자 포함 8글자 이상의 비밀번호를 설정해주세요.'});
        } else if (newPwCheck.length === 0) {
            setIsWrong(true);
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'경고', message: '비밀번호 재입력을 입력해주세요.'});
        } else if (newPw !== newPwCheck) {
            setIsWrong(true);
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'경고', message: '동일한 비밀번호를 입력해주세요.'});
        }
        if (!isWrong){
            try{
                const token = JSON.parse(await AsyncStorage.getItem('token'));
                axios.put(`${API_URL}/api/auth/password/update`, {password:newPw}, {
                    headers:{"Content-Type":'application/json', Authorization: `Bearer ${token.token}`}
                })
                .then(res => {
                    const result = res.data;
                    // console.log(result);
                    navigation.pop();
                    navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message:'비밀번호가 변경되었습니다.'});
                })
            }catch{
                // console.log;
            }
        }
    }
    return(
        <AuthLayout navigation={navigation} route={route}>
        <KeyboardLayout>
        <View style={{alignItems: 'center', justifyContent:'center'}}>
            <View style={{marginTop:hp('7%'), height:hp('17%')}}>
                <Image style={{flex:1,objectFit:'contain'}} source={require('../../../assets/myongjicamp-title.png')}/>
            </View>
            <View style={{marginTop:hp('4%'), height:hp('55%'), width:'80%', borderWidth:1, borderRadius:20, paddingVertical:hp('3%'),paddingHorizontal:hp('2%')}}>
                <Text style={[{fontSize:13, marginLeft:'2.5%', marginBottom:hp('0.5%')}, isChecked ? {color:'lightgray'} : undefined]}>현재 비밀번호</Text>
                <TextInput placeholder="현재 비밀번호를 입력하세요" placeholderTextColor={isChecked ? '#cccccc' : undefined}
                    value={currentPw} onChangeText={(text)=>setCurrentPw(text)} secureTextEntry editable={!isChecked}
                    style={[{backgroundColor:'lightgray', borderRadius:20, height:hp('8%'), paddingHorizontal:16, marginBottom:hp('3%')}, isChecked ? {backgroundColor:'#e8e8e8', color:'#cccccc'} : undefined]} />
                <Text style={[{fontSize:13, marginLeft:'2.5%', marginBottom:hp('0.5%')},!isChecked ? {color:'lightgray'} : undefined]}>새 비밀번호</Text>
                <TextInput placeholder="새로운 비밀번호를 입력하세요" editable={isChecked}
                    value={newPw} onChangeText={(text)=>setNewPw(text)} secureTextEntry placeholderTextColor={!isChecked ? '#cccccc' : undefined}
                    style={[{backgroundColor:'lightgray', borderRadius:20, height:hp('8%'), paddingHorizontal:16, marginBottom:hp('2%')}, !isChecked ? {backgroundColor:'#e8e8e8'} : undefined]} />
                <TextInput placeholder="새로운 비밀번호를 재입력하세요" editable={isChecked}
                    value={newPwCheck} onChangeText={(text) => setNewPwCheck(text)} secureTextEntry placeholderTextColor={!isChecked ? '#cccccc' : undefined}
                    style={[{ backgroundColor: 'lightgray', borderRadius: 20, height: hp('8%'), paddingHorizontal: 16 }, !isChecked ? {backgroundColor:'#e8e8e8'} : undefined]} />
                <View style={{justifyContent:'center', alignItems:'center', marginTop:hp('1%')}}>
                    {isChecked ? (
                    <TouchableOpacity disabled={isPressed} onPress={handlePwChange} style={{marginTop:hp('3.8%'), backgroundColor: '#4ea1d3', height: hp('7%'), width: '50%', justifyContent: 'center', alignItems: 'center', borderRadius: 16 }}>
                        <Text style={{ color: 'white' }}>비밀번호 변경</Text>
                    </TouchableOpacity>
                    ) : (<>
                    <TouchableOpacity onPress={()=>navigation.navigate('PwFind')}>
                        <Text style={{fontSize:12, textDecorationLine:'underline', marginBottom:hp('3%')}}>비밀번호가 기억나지 않으신가요?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={isPressed} onPress={handlePwCheck} style={{backgroundColor:'#4ea1d3', height:hp('7%'), width:'50%', justifyContent:'center', alignItems:'center', borderRadius:16}}>
                        <Text style={{color:'white'}}>비밀번호 확인</Text>
                    </TouchableOpacity>
                    </>)}
                </View>
            </View>
        </View>
        </KeyboardLayout>
        </AuthLayout>
    )
}