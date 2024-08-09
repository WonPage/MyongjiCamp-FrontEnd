import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DefaultLayout from "../../layout/keyboardlayout";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Modal } from "react-native";
import AuthLayout from "../../layout/authlayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Loading from "../(other)/loading";
import { heightPercentageToDP as hp} from "react-native-responsive-screen";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Scrap({navigation, route}) {
  const [scrapList, setScrapList] = useState([]);
  const [statusMode, setStatusMode] = useState('RECRUIT_ONGOING');
  const getScrapPost = async(statusMode) => {
    const boardType = (statusMode==='COMPLETE'?'complete':'recruit');
    try{
      const token = JSON.parse(await AsyncStorage.getItem('token'));
      axios.get(`${API_URL}/api/auth/scrap?boardType=${boardType}`, { 
        headers: {Authorization: `Bearer ${token.token}`}
      })
      .then(res => {
        console.log(res.data.data);
        const result = res.data.data;
        const scrapList = result.filter(item=>item.recruitStatus===statusMode);
        setScrapList(scrapList);
      })
      .catch(err => {
        console.log(err)
      })
    } catch(err) {
      console.log(err)
    }
  }
  useEffect(()=>{
    getScrapPost(statusMode);
  },[statusMode])
    return (
      <AuthLayout navigation={navigation} route={route}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={scrapList.length === 0 ? { flex: 1 } : undefined}>
            <View style={{ flexDirection: 'row', justifyContent:'space-around', marginTop:hp('3%')}}>
              <TouchableOpacity onPress={() => {
                setStatusMode('RECRUIT_ONGOING');
              }} style={[ {paddingHorizontal:'7%', paddingVertical:hp('1%'), borderRadius:10},
                statusMode === 'RECRUIT_ONGOING' ? { backgroundColor: '#425E7F' } : { backgroundColor: 'white' }]}>
                <Text style={statusMode === 'RECRUIT_ONGOING' ? { color: '#FFFFFF' } : { backgroundColor: 'white' }}>모집 중</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setStatusMode('RECRUIT_COMPLETE')
              }} style={[ {paddingHorizontal:'7%', paddingVertical:hp('1%'), borderRadius:10},
                statusMode === 'RECRUIT_COMPLETE' ? { backgroundColor: '#425E7F' } : { backgroundColor: 'white' }]}>
                <Text style={statusMode === 'RECRUIT_COMPLETE' ? { color: '#FFFFFF' } : { backgroundColor: 'white' }}>모집 완료</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setStatusMode('COMPLETE')
              }} style={[ {paddingHorizontal:'7%', paddingVertical:hp('1%'), borderRadius:10},
              statusMode === 'COMPLETE' ? {backgroundColor:'#425E7F'}:{backgroundColor:'white'}]}>
                <Text style={statusMode === 'COMPLETE' ? { color: '#FFFFFF' } : { backgroundColor: 'white' }}>개발 완료</Text>
              </TouchableOpacity>
            </View>
            {scrapList.length === 0 ? (
              <Empty/>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop:30}}>
              {scrapList.map((item, index) => {
                return (
                  <TouchableOpacity activeOpacity={0.4} key={index} onPress={()=>navigation.navigate('PostDetail', {
                    title:(statusMode==='RECRUIT_ONGOING'?'모집 중':
                    statusMode==='RECRUIT_COMPLETE'?'모집 완료':
                    statusMode==='COMPLETE'?'개발 완료':undefined), boardId:item.boardId})}>
                    <View style={{
                      borderRadius: 10, height: hp('22%'), marginBottom: hp('1.5%'), elevation: 1,
                      backgroundColor: 'white', padding: hp('1.5%'), flexDirection: 'row'}}>
                      {item.imageUrl ? (
                        <View style={{ width: '30%' }}>
                          <Text>{`${item.imageUrl}`}</Text>
                        </View>
                      ) : undefined}
                      <View style={{justifyContent:'space-between'}}>
                        <Text>{`직무:${item.roles}`}</Text>
                        <Text>{`제목:${item.title}`}</Text>
                        <Text>{`댓글수:${item.commentCount}`}</Text>
                        <Text>{`예상기간:${item.expectedDuration}`}</Text>
                        <Text>{`수정날짜:${item.modifiedDate}`}</Text>
                        <Text>{`스크랩카운트:${item.scrapCount}`}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ) 
              })}
              </ScrollView>
            )}
          </ScrollView>
        </View>
      </AuthLayout>
    );
  };
  
function Empty(){
  return(
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <View style={{backgroundColor:'#A1ADBC', width:'85%', height:hp('35%'), borderRadius:20, justifyContent:'center', alignItems:'center'}}>
        <Text style={{fontSize:15, color:'#F3F5F6', fontWeight:'500'}}>아직 스크랩한 게시글이 없습니다.</Text>
      </View>
    </View>
  )
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal:'5%'
    },
  });