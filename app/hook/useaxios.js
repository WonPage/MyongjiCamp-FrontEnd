import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
export async function useGET(api_url, params = undefined){
    const searchParams = new URLSearchParams();
    if (params) {
        params.map((param)=>{
            searchParams.append(param.key, param.value);
        })
    }
    const [ result, setResult ] = useState();
    try{ 
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        axios.get(`${API_URL}${api_url}?${searchParams.toString()}`, {
            headers: {Authorization: `Bearer ${token.token}`}
        })
        .then(res => {
            const data = res.data;
            setResult(data);
            // console.log('GET Success :', data);
        })
        .catch(error => {
            const data = error.response.data;
            setResult(data);
            // console.log('GET Error :', data);
        })
        .then(()=>{ return result })
    } catch(error) {console.log('AsyncStorage Error :',error)};
}

export async function usePOST(api_url, body = {}){
    const [ result, setResult ] = useState();
    try{ 
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        axios.post(`${API_URL}${api_url}`, body, {
            headers: {
                'Content-Type':'application/json',
                Authorization: `Bearer ${token.token}`,
            }
        })
        .then(res => {
            const data = res.data;
            setResult(data);
            // console.log('POST Success :', data);
        })
        .catch(error => {
            const data = error.response.data;
            setResult(data);
            console.log('POST Error :', data);
        })
        // .then(()=> { return result })
    } catch(error) {console.log('AsyncStorage Error :',error)};
    return () => result;
}
