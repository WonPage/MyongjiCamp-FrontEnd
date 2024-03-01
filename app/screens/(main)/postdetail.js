import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput } from "react-native";
import { StatusBar, StyleSheet } from "react-native";
import { View } from "react-native";

export default function PostDetail({ navigation, route }) {

    return (
        <ScrollView>
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Detail/>
            <Comment boardId={route.params.boardId}/>
        </View>
        </ScrollView>
    )
}

function Detail() {
    return (
        <View></View>
    )
}

function Comment({boardId}) {
    const [comment, setComment] = useState('');
    const [commentList, setCommentList] = useState();
    const writeComment = async () => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        axios.post(`${process.env.API_URL}/api/auth/recruit/${boardId}/comment`, {
            content: comment,
            cdepth: 0
        }, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token.token}` } })
            .then(res => {
                const result = res.data;
                // console.log('성공', result);
                getComment();
                setComment('');
            })
            .catch(error => {
                const result = error.response.data;
                // console.log('에러', result)
            })
    }
    const getComment = async () => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        axios.get(`${process.env.API_URL}/api/auth/recruit/${boardId}/comment`, {
            headers: {
                Authorization: `Bearer ${token.token}`,
            }
        })
            .then(res => {
                const result = res.data;
                console.log('성공', result);
                setCommentList(result.data);
            })
            .catch(error => {
                const result = error.response.data;
                console.log('실패', result);
            })
    }
    useEffect(() => {
        getComment();
    }, [])
    return (
        <View>
            <TextInput style={{ borderWidth: 1, height: 50 }}
                value={comment} onChangeText={setComment} />
            <Pressable onPress={writeComment}
                style={{ backgroundColor: 'yellow', alignItems: 'center', justifyContent: 'center', height: 50 }}>
                <Text>댓글 작성</Text>
            </Pressable>
            {commentList ? commentList.reverse().map((comment, index) => (
                <View key={index} style={styles.comment_item_container}>
                    <Text>{`프로필 아이콘 : ${comment.profileIcon}`}</Text>
                    <Text>{`닉네임 : ${comment.nickname}`}</Text>
                    <Text>{`내용 : ${comment.content}`}</Text>
                    <Text>{comment.commentCreateDate}</Text>
                </View>
            )) : (<></>)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {flex:1},

})