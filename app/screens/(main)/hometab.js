import { BackHandler, Pressable, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import DefaultLayout from "../../layout/keyboardlayout";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAlert } from "../../hook/usealert";
import Loading from "../(other)/loading";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function OnGoing({navigation, route}) {
    const [onGoingList, setOnGoingList] = useState();
    const [page, setPage] = useState(0);
    // axios.get으로 query를 담아서 보냄. 
    const getOnGoing = (addMode = false) => {
        const params = new URLSearchParams();
        params.append('keyword', '');
        params.append('pageNum', addMode ? page+1 : page);
        params.append('direction', 'DESC');
        params.append('boardType', 'recruit');
        params.append('status', 'ongoing');
        if (!addMode) {
            try{
            axios.get(`${API_URL}/api/board?${params.toString()}`)
            .then(res => {
                const result = res.data;
                // console.log('Home Render :', result.data);
                setOnGoingList(result.data);
            })
            .catch(error => {
                // console.log(error);
                // const result = error.response.data;
                // console.log('Home Render Failed :', error);
            })
            }catch(err){
                console.log(err)
            };
        } else {
            try{
            axios.get(`${API_URL}/api/board?${params.toString()}`)
            .then(res => {
                const result = res.data;
                const newList = onGoingList.concat(result.data);
                setOnGoingList(newList);
                setPage(page+1);
            })
            .catch(error => {
                // console.log(error);
            })
            } catch(err){console.log(err)};
        }
    }
    useEffect(()=>{
        getOnGoing();
        const refresh = navigation.addListener('focus', ()=>{getOnGoing()});
        return refresh;
    }, [navigation]);

    const moveDetail = (boardId) => {
        // console.log(boardId);
        navigation.navigate('PostDetail', {title: '모집 중', boardId: boardId});
    }

    const handleMoreButton = () => {
        getOnGoing(true);
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={onGoingList ? {backgroundColor:'#f4f7f9'} : {backgroundColor:'#f4f7f9', flex:1}} showsVerticalScrollIndicator={false}>
                <StatusBar style="auto" />
                {onGoingList ? onGoingList.map((item, index) => {
                    const date = new Date(item?.modifiedDate);      
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;
                    const newMonth = month.toString().padStart(2, '0');
                    const day = date.getDate().toString().padStart(2, '0');
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    const dateFormat = `${year}.${newMonth}.${day}  ${hours}:${minutes}`   
                    return (
                    <TouchableOpacity activeOpacity={0.5} key={index} onPress={()=>{moveDetail(item.boardId)}}>
                        <View style={{ borderRadius: 10, height:hp('22%'), marginBottom:hp('1.5%'), elevation:1,
                        backgroundColor:'white', padding:hp('1.5%'), justifyContent:'space-between'}}>
                            <View>
                                <View style={{flexDirection:'row', marginBottom:hp('0.3%')}}>
                                    {item.roles.map((role, index)=>{
                                        let roleName = '';
                                        if (role === 'BACK') roleName = '백엔드';
                                        else if (role === 'FRONT') roleName = '프론트엔드';
                                        else if (role === 'DESIGN') roleName = '디자인';
                                        else if (role === 'FULL') roleName = '풀스택';
                                        else if (role === 'PM') roleName = '기획';
                                        else roleName = role;
                                        return (
                                        <View key={index} style={[{borderRadius:15, paddingVertical:2, paddingHorizontal:4,marginRight:hp('0.5%')},
                                        role=='BACK'? {backgroundColor:'#8FCACA'}: role=='FRONT' ? {backgroundColor:'#FFAEA5'} :
                                        role=='DESIGN' ? {backgroundColor:'#EFD0B2'}: role=='PM' ? {backgroundColor:'#CBAACB'} :
                                        role=='AI' ? {backgroundColor: '#F3B0C3'}: role=='FULL' ? {backgroundColor:'#B6CFB6'} : {backgroundColor: '#AFAFAF'}]}>
                                            <Text style={{fontSize:12, color:'white', fontWeight:'500'}}>{` ${roleName} `}</Text>
                                        </View>
                                    )})}
                                </View>
                                <View>
                                    <Text style={{fontSize:25}}>{item.title}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                <Text>{dateFormat}</Text>
                                <View style={{flexDirection:'row'}}>
                                    <MaterialCommunityIcons name="comment-outline" size={23} color="black" />
                                    <Text style={{marginLeft:hp('0.3%')}}>{item.commentCount}</Text>
                                    <FontAwesome name="bookmark-o" size={23} color="black" style={{marginLeft:hp('1.5%')}}/>
                                    <Text style={{marginLeft:hp('0.5%')}}>{item.scrapCount}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}) : (<Loading/>)}
                <View
                style={{justifyContent:'center', alignItems:'center', height:hp('8%'), marginBottom:hp('1%')}}>
                    <TouchableOpacity onPress={handleMoreButton} style={{borderRadius:16, backgroundColor:'gray', padding:hp('1.5%')}}>
                        <Text style={{color:'white'}}>더 보기</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

export function Complete({navigation}){
    const [completeList, setCompleteList] = useState();
    const [page, setPage] = useState(0);
    // axios.get으로 query를 담아서 보냄. 
    const getComplete = (addMode = false) => {
        try{
        const params = new URLSearchParams();
        params.append('keyword', '');
        params.append('pageNum', addMode ? page+1 : page);
        params.append('direction', 'DESC');
        params.append('boardType', 'recruit');
        params.append('status', 'complete');
        if (!addMode) {
            axios.get(`${API_URL}/api/board?${params.toString()}`)
            .then(res => {
                const result = res.data;
                // console.log('Home Render :', result.data);
                setCompleteList(result.data);
            })
            .catch(error => {
                // console.log(error);
                // const result = error.response.data;
                // console.log('Home Render Failed :', error);
            })
        } else {
            axios.get(`${API_URL}/api/board?${params.toString()}`)
            .then(res => {
                const result = res.data;
                const newList = completeList.concat(result.data);
                setCompleteList(newList);
                setPage(page+1);
            })
            .catch(error => {
                console.log(error);
            })
        }
        } catch(err){console.log(err)}
    }
    useEffect(()=>{
        getComplete();
        const refresh = navigation.addListener('focus', ()=>{getComplete()});
        return refresh;
    }, [navigation]);

    const moveDetail = (boardId) => {
        // console.log(boardId);
        navigation.navigate('PostDetail', {title: '모집 완료', boardId: boardId});
    }
    const handleMoreButton = () => {
        getComplete(true);
    }
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={completeList ? {backgroundColor:'#f2f2f2'} : {backgroundColor:'#f2f2f2', flex:1}} showsVerticalScrollIndicator={false}>
                <StatusBar style="auto" />
                {completeList ? completeList.map((item, index) => {
                    const date = new Date(item?.modifiedDate);      
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;
                    const newMonth = month.toString().padStart(2, '0');
                    const day = date.getDate().toString().padStart(2, '0');
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    const dateFormat = `${year}.${newMonth}.${day}  ${hours}:${minutes}`   
                    return (
                    <TouchableOpacity activeOpacity={0.5} key={index} onPress={()=>{moveDetail(item.boardId)}}>
                        <View style={{ borderRadius: 10, height:hp('22%'), marginBottom:hp('1.5%'),
                        backgroundColor:'white', padding:hp('1.5%'), justifyContent:'space-between'}}>
                            <View>
                                <View style={{flexDirection:'row', marginBottom:hp('0.3%')}}>
                                    {item.roles.map((role, index)=>{
                                        let roleName = '';
                                        if (role === 'BACK') roleName = '백엔드';
                                        else if (role === 'FRONT') roleName = '프론트엔드';
                                        else if (role === 'DESIGN') roleName = '디자인';
                                        else if (role === 'FULL') roleName = '풀스택';
                                        else if (role === 'PM') roleName = '기획';
                                        else roleName = role;
                                        return (
                                            <View key={index} style={[{borderRadius:15, paddingVertical:2, paddingHorizontal:4,marginRight:hp('0.5%')},
                                            role=='BACK'? {backgroundColor:'#8FCACA'}: role=='FRONT' ? {backgroundColor:'#FFAEA5'} :
                                            role=='DESIGN' ? {backgroundColor:'#EFD0B2'}: role=='PM' ? {backgroundColor:'#CBAACB'} :
                                            role=='AI' ? {backgroundColor: '#F3B0C3'}: role=='FULL' ? {backgroundColor:'#B6CFB6'} : {backgroundColor: '#AFAFAF'}]}>
                                                <Text style={{fontSize:12, color:'white', fontWeight:'500'}}>{` ${roleName} `}</Text>
                                            </View>
                                    )})}
                                </View>
                                <View>
                                    <Text style={{fontSize:25}}>{item.title}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                <Text>{dateFormat}</Text>
                                <View style={{flexDirection:'row'}}>
                                    <MaterialCommunityIcons name="comment-outline" size={23} color="black" />
                                    <Text style={{marginLeft:hp('0.3%')}}>{item.commentCount}</Text>
                                    <FontAwesome name="bookmark-o" size={23} color="black" style={{marginLeft:hp('1.5%')}}/>
                                    <Text style={{marginLeft:hp('0.5%')}}>{item.scrapCount}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}) : (<Loading/>)}
                <View
                style={{justifyContent:'center', alignItems:'center', height:hp('8%'), marginBottom:hp('1%')}}>
                    <TouchableOpacity onPress={handleMoreButton} style={{borderRadius:16, backgroundColor:'gray', padding:hp('1.5%')}}>
                        <Text style={{color:'white'}}>더 보기</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

export function Finish() {
    const alert = useAlert({message:'안녕하세요'});
    return(
        <View style={styles.container}>
            <StatusBar style="auto"/>
            <Pressable onPress={alert}><Text>네비게이션 확인</Text></Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        height:'100%',
    },

    comment_item_container:{
        borderWidth: 1
    }
});