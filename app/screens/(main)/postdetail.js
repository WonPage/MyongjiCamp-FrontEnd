import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput } from "react-native";
import { StatusBar, StyleSheet } from "react-native";
import { View } from "react-native";
import { useComment } from "../../hook/usecomment";
const API_URL = process.env.API_URL;

export default function PostDetail({ navigation, route }) {

    return (
        <ScrollView>
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Detail/>
            <Comment/>
        </View>
        </ScrollView>
    )
}

function Detail() {
    return (
        <View></View>
    )
}

function Comment() {
    const [comment, setComment] = useState('');
    const [commentList, setCommentList] = useState();
    const {getComment, writeComment} = useComment();

    useEffect(()=>{
        getComment().then((data)=>setCommentList(data));
    },[])
    const handleCommentSubmit = () => {
        writeComment(comment, 0)
        .then(()=>{
            getComment().then((data) => setCommentList(data)); // 댓글 작성 후 목록 다시 불러옴
            setComment(''); // 댓글 작성 후 입력창 초기화
        })
        .catch((error) => {
            // console.error('댓글 작성 오류:', error)
        });
    }

    return (
        <View>
            <TextInput style={{ borderWidth: 1, height: 50 }}
                value={comment} onChangeText={setComment} />
            <Pressable onPress={handleCommentSubmit}
                style={{ backgroundColor: 'yellow', alignItems: 'center', justifyContent: 'center', height: 50 }}>
                <Text>댓글 작성</Text>
            </Pressable>
            {commentList ? commentList.map((comment, index) => (
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