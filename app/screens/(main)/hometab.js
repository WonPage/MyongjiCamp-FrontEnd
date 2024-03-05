import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DefaultLayout from "../../layout/keyboardlayout";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAlert } from "../../hook/usealert";

const API_URL = process.env.API_URL;

export default function OnGoing({navigation, route}) {
    const [onGoingList, setOnGoingList] = useState();
    const [page, setPage] = useState(0);

    // axios.get으로 query를 담아서 보냄. 
    const getOnGoing = () => {
        const params = new URLSearchParams();
        params.append('keyword', '');
        params.append('pageNum', page);
        params.append('direction', 'DESC');
        params.append('boardType', 'recruit');
        params.append('status', 'ongoing');
        
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
    }
    useEffect(()=>{
        getOnGoing();
    }, [])

    const moveDetail = (boardId) => {
        // console.log(boardId);
        navigation.navigate('PostDetail', {title: '모집 중', boardId: boardId});
    }

    return (
        <ScrollView>
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View>
                {onGoingList ? onGoingList.map((item, index) => (
                    <TouchableOpacity key={index} onPress={()=>{moveDetail(item.boardId)}}>
                        <View style={{ borderWidth: 1 }}>
                            <Text>{item.modifiedDate}</Text>
                            <Text>{item.roles}</Text>
                            <Text>{item.title}</Text>
                            <Text>{`스크랩 : ${item.scrapCount}`}</Text>
                        </View>
                    </TouchableOpacity>
                )) : (<></>)}
            </View>
        </View>
        </ScrollView>
    )
}

export function Complete(){
    return (
        <View style={styles.container}>
            <StatusBar style="auto"/>

            <Pressable onPress={async()=>{
                const token = JSON.parse(await AsyncStorage.getItem('token'));
                if (token) {
                    console.log('토큰 있어요', token);
                } else {
                    console.log('토큰 없어요...');
                }
            }}><Text>토큰확인</Text></Pressable>

            <Pressable onPress={async()=>{
                const token = JSON.parse(await AsyncStorage.getItem('token'));
                if (token) {
                    await AsyncStorage.clear();
                } else {
                    console.log('토큰이 이미 없어요');
                }
            }}><Text>토큰 없애버리기</Text></Pressable>
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
        flex: 1,
    },

    comment_item_container:{
        borderWidth: 1
    }
});