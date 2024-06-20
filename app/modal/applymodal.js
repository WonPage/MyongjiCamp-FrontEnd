import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ApplyModal({navigation, title, message, data}){
    const [resumeList, setResumeList] = useState();
    const [selectedResume, setSelectedResume] = useState();
    const [selectedRole, setSelectedRole] = useState();
    const getResumeList = async () => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        axios.get(`${API_URL}/api/auth/resume`, {
            headers: { Authorization: `Bearer ${token.token}` }
        })
            .then(res => {
                setResumeList(res.data.data);
            })
            .catch(err => {
                // console.log(err)
            });
    }
    useEffect(() => {
        getResumeList();
        const refresh = navigation.addListener('focus', ()=>{getResumeList();});
        return refresh;
    }, [])

    const handleApply = async() => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        axios.get(`${API_URL}/api/auth/resume/${selectedResume.id}`)
        .then(res => {
            const content = res.data.data.content;
            const url = res.data.data.url;
            const inputData = {
                role : selectedRole,
                content : content,
                url : url
            }
            axios.post(`${API_URL}/api/auth/apply/${data.boardId}`, inputData, {
                headers: { Authorization: `Bearer ${token.token}`, "Content-Type":"application/json" }
            })
            .then(res => {
                navigation.goBack();
                navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message:res.data.data})
            })
        })
    }
    return (
        <View style={{ marginHorizontal: '7%'}}>
            {/* 제목 */}
            <View style={{ alignItems: 'center', marginTop: hp('3%') }}>
                <Text style={{ fontSize: 30 }}>{title}</Text>
            </View>
            {/* 이력서 선택하기 */}
            <View style={{width:'100%', alignItems:'center'}}>
                <Picker
                selectedValue={selectedResume}
                onValueChange={(value)=>{
                    setSelectedResume(value);
                }}
                style={{width:'90%'}}
                prompt="지원서를 선택하세요"
                dropdownIconColor={'darkblue'}
                >
                    {resumeList?.map((item, index) => (
                        <Picker.Item style={{fontSize:20}} key={index} label={item.title} value={item} />
                    ))}
                </Picker>
                <Picker
                selectedValue={selectedRole}
                onValueChange={(value)=>{
                    setSelectedRole(value);
                }}
                style={{width:'90%'}}
                placeholder="업무를 선택하세요"
                dropdownIconColor={'darkblue'}
                >
                    {data.role?.map((item, index) => (
                        <Picker.Item style={{fontSize:20}} key={index} label={
                            item.role === 'FRONT' ? '프론트엔드' :
                            item.role === 'BACK' ? '백엔드' :
                            item.role === 'DESIGN' ? '디자인' :
                            item.role === 'PM' ? '기획' :
                            item.role === 'FULL' ? '풀스택' : item.role
                    } value={item.role} />
                    ))}
                </Picker>
                <TouchableOpacity style={{backgroundColor:'#AAAAFF', width:'60%', paddingVertical:hp('2%'), paddingHorizontal:'2%', marginVertical:hp("2%"), justifyContent:'center', alignItems:'center', borderRadius:10}} onPress={()=>navigation.navigate('Resume')}>
                    <Text style={{color:'white', fontSize:18}}>이력서 관리하기</Text>
                </TouchableOpacity>
            </View>
            {/* Notice */}
            <View style={{ flexDirection: 'row' }}>
                <Ionicons name="megaphone-outline" size={24} color="black" />
                <Text>지원 결과는 지원현황 탭에서 확인하실 수 있습니다.</Text>
            </View>
            {/* Apply Button */}
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp('4%'), marginBottom:hp('4%') }}>
                <TouchableOpacity onPress={handleApply} disabled={selectedResume===null ? true : false}
                 style={[{paddingHorizontal: '20%', paddingVertical: hp('3%'), borderRadius: 50 }, selectedResume===null?{backgroundColor: '#E0E0E0'}:{backgroundColor: '#7799F2'}]}>
                    <Text style={ selectedResume===null? { fontSize: 20 } : { color: 'white', fontSize: 20 }}>지원하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}