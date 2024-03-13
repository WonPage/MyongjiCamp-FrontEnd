import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DefaultLayout from "../../layout/keyboardlayout";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Modal } from "react-native";
import AuthLayout from "../../layout/authlayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Loading from "../(other)/loading";
const API_URL = process.env.API_URL;

export default function Scrap({navigation, route}) {
  const [scrapList, setScrapList] = useState([]);
  const [statusMode, setStatusMode] = useState('RECRUIT_ONGOING');
  const getScrapPost = async() => {
    try{
      const token = JSON.parse(await AsyncStorage.getItem('token'));
      axios.get(`${API_URL}/api/auth/scrap`, { 
        headers: {Authorization: `Bearer ${token.token}`}
      })
      .then(res => {
        const result = res.data.data;
        // console.log(result);
        setScrapList(result);
      })
      .catch(err => {
        console.log(err)
      })
    } catch(err) {
      console.log(err)
    }
  }
  useEffect(()=>{
    getScrapPost();
  },[])
  const handleStatusChange = () => {
    getScrapPost();
  }
    return (
      <AuthLayout navigation={navigation} route={route}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={scrapList.length === 0 ? { flex: 1 } : undefined}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => {
                setStatusMode('RECRUIT_ONGOING');
                handleStatusChange();
              }} style={statusMode === 'RECRUIT_ONGOING' ? { backgroundColor: 'gray' } : { backgroundColor: 'white' }}>
                <Text>모집 중</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setStatusMode('RECRUIT_COMPLETE')
                handleStatusChange();
              }} style={statusMode === 'RECRUIT_COMPLETE' ? { backgroundColor: 'gray' } : { backgroundColor: 'white' }}>
                <Text>모집 완료</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setStatusMode('COMPLETE')
                handleStatusChange();
              }} style={statusMode === 'COMPLETE' ? {backgroundColor:'gray'}:{backgroundColor:'white'}}>
                <Text>개발 완료</Text>
              </TouchableOpacity>
            </View>
            {scrapList.length === 0 ? (
              <Loading/>
            ) : (
              scrapList.map((item, index) => {
                return (
                  <TouchableOpacity key={index}>
                    <View style={{borderWidth:1}}>
                      <Text>{`게시글id:${item.boardId}`}</Text>
                      <Text>{`댓글수:${item.commentCount}`}</Text>
                      <Text>{`예상기간:${item.expectedDuration}`}</Text>
                      <Text>{`이미지:${item.imageUrl}`}</Text>
                      <Text>{`수정날짜:${item.modifiedDate}`}</Text>
                      <Text>{`직무:${item.roles}`}</Text>
                      <Text>{`스크랩카운트:${item.scrapCount}`}</Text>
                      <Text>{`제목:${item.title}`}</Text>
                    </View>
                  </TouchableOpacity>
                ) 
              })
            )}
          </ScrollView>
        </View>
      </AuthLayout>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal:'5%'
    },
  });