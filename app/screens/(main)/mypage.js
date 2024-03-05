import { Image, StyleSheet, Text, View } from "react-native";
import DefaultLayout from "../../layout/keyboardlayout";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import AuthLayout from "../../layout/authlayout";
import axios from "axios";

const API_URL = process.env.API_URL;
export default function MyPage({navigation, route}) {
    useEffect(()=>{

    },[])
    const page_list = [
        {page:'Notice', title:'공지사항'},
        {page:'FAQ', title:'FAQ'},
        {page:'Event', title:'이벤트'},
        {page:'Account', title: '계정관리'},
        {page:'Information', title:'이용안내'},
        {page:'NotifySetting', title:'알림설정'},
        {page:'Logout', title:'로그아웃'}
    ]
    return(
        <AuthLayout navigation={navigation} route={route}>
        <View style={[styles.container]}>
            <StatusBar style="auto"/>
            <View style={styles.profile_container}>
                <View style={{flex: 1}}>
                    <View style={{backgroundColor:'gray', width:'80%', height:'50%', borderRadius: 50}}><Text>이미지</Text></View>
                </View>
                <View style={{flex: 2}}>
                    <Text style={{fontSize: 30}}>닉네임</Text>
                    <Text style={{fontSize: 17}}>이메일 주소</Text>
                </View>
            </View>
            <View style={styles.resume_container}>
                <View style={{flex: 1}}></View>
                <View style={{flex: 5}}>
                <TouchableOpacity style={styles.resume_button} onPress={()=>{navigation.navigate('Resume')}}>
                    <Text style={{fontSize: 20}}>이력서 관리</Text>
                </TouchableOpacity>
                </View>
                <View style={{flex: 1}}></View>
            </View>
            <View style={styles.pages_container}>
                <FlatList
                style={{marginTop: 22}}
                contentContainerStyle= {{paddingVertical: 10, paddingHorizontal:34, alignItems: 'flex-start', paddingBottom:-7}}
                data={page_list}
                renderItem={({item}) => <Item title={item.title} page={item.page} navigation={navigation}/>}
                />
            </View>
        </View>
        </AuthLayout>
    )
}
const Item = ({title, page, navigation}) => {
    if (page === 'Logout') {
        return (
            <TouchableOpacity style={styles.page_item} onPress={async()=>{
                const token = JSON.parse(await AsyncStorage.getItem('token'));
                // console.log(token);
                axios.post(`${API_URL}/api/auth/logout`, {}, {
                    headers:{'Content-Type':'application/json', Authorization: `Bearer ${token.token}`}
                })
                .then(res => {
                    AsyncStorage.clear();
                    const data = res.data;
                    console.log('Logout :', data);
                    navigation.reset({
                        index: 0,
                        routes: [{name: 'Login'}],
                    });
                })
                .catch(err => {
                    console.log(err);
                })
            }}>
                <Text style={styles.page_title}>{title}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <TouchableOpacity style={styles.page_item} onPress={()=>{navigation.navigate(page)}}>
            <Text style={styles.page_title}>{title}</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profile_container:{
        flex: 2.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resume_container:{
        flex: 0.8,
        flexDirection: 'row',
    },
    resume_button:{
        width:'100%', height:'100%', borderRadius: 10,
        backgroundColor: 'skyblue',
        justifyContent: 'center', alignItems:'center',
    },
    pages_container:{
        flex: 4,
    },
    page_item :{ marginBottom: 27,},
    page_title: {fontSize: 23}
});