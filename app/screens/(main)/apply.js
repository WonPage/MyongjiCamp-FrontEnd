import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
// getResumes 해서가져오는 값들
// applicantId, applyContent, applyCreateDate, applyUrl, boardCreateDate, boardId, boardTitle,
// finalStatus, firstStatus, icon, memberId, nickname, num, resultContent, resultUrl, role
export default function Apply({navigation, route}) {
    const {getAppliedResume, getReceivedResume} = useApply();
    const [appliedResume, setAppliedResume] = useState();
    const [receivedResume, setReceivedResume] = useState();
    const getResumes = async() => {
        await getAppliedResume().then(res => {
            console.log('Applied', res.data);
            setAppliedResume(res.data);
        });
        await getReceivedResume().then(res => {
            console.log('Received', res.data);
            setReceivedResume(res.data);
        })
    } 
    useEffect(()=>{
        getResumes();
    },[])
    return (
        <AuthLayout navigation={navigation} route={route}>
            <View style={styles.container}>
                <StatusBar style="auto" />
                <Text>내가 지원한 글</Text>
                <ScrollView horizontal={true}>
                    {appliedResume?.map((resume, index) => (
                        <View key={index} style={{width:hp('20%'), height:hp('20%'), backgroundColor:'lightgray', margin:10}}>
                            <Text>{resume.firstStatus}</Text>
                            <Text>{resume.applyCreateDate}</Text>
                            <Text>{resume.boardTitle}</Text>
                        </View>
                    ))}
                </ScrollView>
                <Text>내가 작성한 글</Text>
                <ScrollView horizontal={true}>
                    {receivedResume?.map((resume, index) => (
                        <View key={index} style={{width:hp('20%'), height:hp('20%'), backgroundColor:'lightgray', margin:10}}>
                            <Text>{resume.firstStatus}</Text>
                            <Text>{resume.boardCreateDate}</Text>
                            <Text>{resume.boardTitle}</Text>
                            <Text>{resume.num}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </AuthLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});