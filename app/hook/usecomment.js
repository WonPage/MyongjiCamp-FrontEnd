import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

const API_URL = process.env.API_URL;
export const useComment = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const boardId = route.params.boardId;

    const getComment = async () => {
        try {
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            const response = await axios.get(`${API_URL}/api/auth/recruit/${boardId}/comment`, {
                headers: { Authorization: `Bearer ${token.token}` },
            });
            const result = response.data.data;
            return result;
        } catch (error) {
            // console.error('댓글 목록 가져오기 오류:', error);
            // 상황에 맞는 에러 처리, 예: 사용자에게 에러 메시지 보여주기
        }
    };

    const writeComment = async (comment = undefined, cdepth = 0) => {
        try {
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            const response = await axios.post(`${API_URL}/api/auth/recruit/${boardId}/comment`, {
                content: comment,
                cdepth: cdepth,
            }, {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token.token}` },
            });
            const result = response.data;
            navigation.navigate('ModalLayout', { component: 'MyAlert', title: '안내', message: result.data });
        } catch (error) {
            console.error('댓글 작성 오류:', error);
            // 상황에 맞는 에러 처리, 예: 사용자에게 에러 메시지 보여주기
        }
    };

    return { getComment, writeComment };
};