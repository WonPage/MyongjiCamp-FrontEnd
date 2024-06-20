import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native"
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
export default function useReport() {
        const navigation = useNavigation();
        async function postReport(data) {
                try {
                        const token = JSON.parse(await AsyncStorage.getItem('token'));
                        const result = axios.post(`${API_URL}/api/auth/report/${data.targetId}`, data, {
                                headers: {
                                        Authorization: `Bearer ${token.token}`,
                                        'Content-Type': 'application/json'
                                },
                        })
                        .then(response => {
                                return response.data;
                        });
                        return result;
                } catch (error) {
                        console.log(error + '게시글 신고 실패');
                }
        }
        async function commentReport(data) {
                try {
                        const token = JSON.parse(await AsyncStorage.getItem('token'));
                        const result = axios.post(`${API_URL}/api/auth/report/${data.targetId}`, data, {
                                headers: {
                                        Authorization: `Bearer ${token.token}`,
                                        'Content-Type': 'application/json'
                                },
                        })
                        .then(response => {
                                return response.data;
                        });
                        return result;
                } catch (error) {
                        console.log(error + '댓글 신고 실패');
                }
        }
        return { postReport, commentReport };
}