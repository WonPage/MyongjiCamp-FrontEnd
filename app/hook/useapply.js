import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function useApply(){
        async function getAppliedResume(){
                const token = JSON.parse(await AsyncStorage.getItem('token'));
                const result = axios.get(`${API_URL}/api/auth/apply/applicant`,{
                        headers: {
                                Authorization: `Bearer ${token.token}`
                        },
                })
                .then(res => {
                        return res.data;
                })
                return result;
        }
        async function getReceivedResume(){
                const token = JSON.parse(await AsyncStorage.getItem('token'));
                const result = axios.get(`${API_URL}/api/auth/apply/writer`,{
                        headers: {
                                Authorization: `Bearer ${token.token}`
                        },
                })
                .then(res => {
                        return res.data;
                })
                return result;
        }
        return {getAppliedResume, getReceivedResume}
}