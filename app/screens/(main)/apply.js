import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DefaultLayout from "../../layout/keyboardlayout";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthLayout from "../../layout/authlayout";
import ModalLayout from "../../modal/modallayout";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import useApply from "../../hook/useapply";
import { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
// getResumes 해서가져오는 값들
// applicantId, applyContent, applyCreateDate, applyUrl, boardCreateDate, boardId, boardTitle,
// finalStatus, firstStatus, icon, memberId, nickname, num, resultContent, resultUrl, role
export default function Apply({navigation, route}) {
    const {getAppliedResume, getReceivedResume, getResumeDetail, getReceivedResumeList} = useApply();
    const [appliedResume, setAppliedResume] = useState();
    const [receivedResume, setReceivedResume] = useState();
    const getResumes = async() => {
        await getAppliedResume().then(res => {
            // console.log('Applied', res.data);
            setAppliedResume(res.data);
        });
        await getReceivedResume().then(res => {
            // console.log('Received', res.data);
            setReceivedResume(res.data);
        })
    } 
    useEffect(()=>{
        getResumes();
    },[])
    const handleShowResume = async(resumeId) => {
        await getResumeDetail(resumeId)
        .then(res =>{
            navigation.navigate('ModalLayout', {component:'ResumeDetail', title:'지원한 이력서', data:res.data});
        })
    }
    const handleReceivedResumeList = async(boardId) => {
        await getReceivedResumeList(boardId)
        .then(res => {
            navigation.navigate('ModalLayout', {component:'ResumeList', data:{data:res.data, boardId:boardId}});
        })
    }
    return (
        <AuthLayout navigation={navigation} route={route}>
            <ScrollView style={styles.container} contentContainerStyle={{marginHorizontal:'5%'}}>
                <StatusBar style="auto" />
                <Text style={{fontSize:27, fontWeight:'300', marginTop:hp('5%')}}>내가 지원한 글</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {appliedResume?.map((resume, index) => {
                        const date = new Date(resume.applyCreateDate);      
                        const year = date.getFullYear();
                        const month = date.getMonth() + 1;
                        const newMonth = month.toString().padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        const dateFormat = `${year}.${newMonth}.${day}`   
                        return (
                        <View key={index} style={{width:hp('26%'), height:hp('24%'), backgroundColor:'lightgray', margin:10, elevation:5, borderRadius:5, padding:10, justifyContent:'space-between'}}>
                            <View>
                                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                    <View style={{backgroundColor:'white', borderRadius:10, paddingHorizontal:6}}>
                                        <Text>{resume.firstStatus === 'PENDING' ? '대기중':
                                        resume.firstStatus === 'ACCEPTED' ? '승인':
                                        resume.firstStatus === 'REJECTED' ? '거절':
                                        resume.firstStatus === 'DELETED' ? '삭제됨' : undefined}</Text>
                                    </View>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <Text style={{fontSize:13}}>{dateFormat}</Text>
                                        <Entypo style={{marginLeft:3}} name="dots-three-vertical" size={17} color="white" />
                                    </View>
                                </View>
                                <Text style={{fontSize:30, marginTop:3}}>{resume.boardTitle}</Text>
                            </View>
                            <View style={{justifyContent:'center', alignItems:'center'}}>
                                <TouchableOpacity onPress={resume.firstStatus==='PENDING' ? ()=>{handleShowResume(resume.applicationId)} : ()=>{handleShowMessage(resume.resultContent)}}
                                style={{flexDirection:'row', backgroundColor:'white', paddingHorizontal:20, paddingVertical:9, borderRadius:20}}>
                                    <Text style={{fontSize:18, marginRight:5}}>{resume.firstStatus === 'PENDING' ? '보낸 이력서' : '메세지 확인'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )})}
                </ScrollView>
                <Text style={{fontSize:27, fontWeight:'300', marginTop:hp('5%')}}>내가 작성한 글</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {receivedResume?.map((resume, index) => {
                        const date = new Date(resume.boardCreateDate);      
                        const year = date.getFullYear();
                        const month = date.getMonth() + 1;
                        const newMonth = month.toString().padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        const dateFormat = `${year}.${newMonth}.${day}` 
                        return (
                        <View key={index} style={{width:hp('26%'), height:hp('24%'), backgroundColor:'lightgray', margin:10, elevation:5, borderRadius:5, padding:10, justifyContent:'space-between'}}>
                            <View>
                                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                    <Text>{resume.firstStatus}</Text>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <Text style={{fontSize:13}}>{dateFormat}</Text>
                                        <Entypo style={{marginLeft:3}} name="dots-three-vertical" size={17} color="white" />
                                    </View>
                                </View>
                                <Text style={{fontSize:30, marginTop:3}} ellipsizeMode="tail" numberOfLines={2}>{resume.boardTitle}</Text>
                            </View>
                            <View style={{justifyContent:'center', alignItems:'center'}}>
                                <TouchableOpacity onPress={()=>handleReceivedResumeList(resume.boardId)}
                                style={{flexDirection:'row', backgroundColor:'white', paddingHorizontal:20, paddingVertical:9, borderRadius:20}}>
                                    <Text style={{fontSize:18, marginRight:5}}>받은 이력서</Text>
                                    <Text style={{fontSize:18, color:'skyblue'}}>{resume.num}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )})}
                </ScrollView>
            </ScrollView>
        </AuthLayout>
    )
}

const styles = StyleSheet.create({
    container: {
    }
});