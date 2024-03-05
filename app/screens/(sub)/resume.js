import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const API_URL = process.env.API_URL;
export default function Resume({ navigation }) {
    const [resumeList, setResumeList] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalResumeData, setModalResumeData] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const getResumeList = async() => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        axios.get(`${API_URL}/api/auth/resume`, {
            headers: {Authorization: `Bearer ${token.token}`}
        })
        .then(res => {
            setResumeList(res.data.data);
        })
        .catch(err => {
            // console.log(err)
        });
    }
    useEffect(()=>{
        getResumeList();
    }, [])

    const handleResumeAdd = async() => {
        try{
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            axios.post(`${API_URL}/api/auth/resume`, {title: '테스트', content: '테스트다 하하하', url: 'dsafskdnfnaa.com'}, {
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${token.token}`
                }})
            .then(res => {
                Alert.alert('안내', res.data.data);
                getResumeList();
            })
            .catch(error=> {
                // console.log(error);
                Alert.alert('경고', '글 작성에 실패하였습니다.');
                getResumeList();
            })
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.notice_container}>
                <Ionicons name="megaphone-outline" size={24} color="black" />
                <Text>이력서는 최대 3개 저장할 수 있습니다.</Text>
            </View>
            <View style={styles.resume_container}>
                <FlatList
                    style={{marginHorizontal: hp('3%')}}
                    contentContainerStyle={styles.resume_item_container}
                    data={resumeList}
                    
                    ListFooterComponent={resumeList === null || resumeList?.length>=3 ? ( <></> ):
                    (
                        <TouchableOpacity style={[styles.resume_add_button, {marginTop: hp('5%')}]} onPress={handleResumeAdd}><Text>+ 이력서 추가하기</Text></TouchableOpacity>
                    )}
                    ItemSeparatorComponent={<View style={{height:hp('6%')}}></View>}
                    renderItem={({ item }) => <ResumeItem title={item.title} createDate={item.createDate} id={item.id} getResumeList={getResumeList} setModalVisible={setModalVisible} setModalResumeData={setModalResumeData}/>} />
                {modalResumeData ? (
                <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={()=>setModalVisible(false)}
                transparent={true}
                >
                    <Pressable style={{flex:1, backgroundColor:'transparent'}} onPress={()=>setModalVisible(false)}/>
                    <View style={Platform.OS === 'ios' ? styles.modal_container_ios : styles.modal_container_android}>
                        <View style={styles.modal_resume_buttons}>
                            <TouchableOpacity style={ Platform.OS==='ios' ? ([styles.resume_button_ios, {backgroundColor: 'gray'}]) : ([styles.resume_button_android, {backgroundColor: 'gray'}])}>
                                <Text style={{color:'white'}}>임시저장</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>{setModalVisible(false);}}
                                style={ Platform.OS==='ios' ? ([styles.resume_button_ios, {backgroundColor: 'blue'}]) : ([styles.resume_button_android, {backgroundColor: 'blue'}])}>
                                <Text style={{color:'white'}}>저장</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={ Platform.OS==='ios' ? ([styles.resume_button_ios, {backgroundColor: 'red'}]) : ([styles.resume_button_android, {backgroundColor: 'red'}])}>
                                <Text style={{color:'white'}}>삭제</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modal_resume_title}>
                            <Text style={{marginLeft:3, marginBottom:3}}>제목</Text>
                            <TextInput editable={isEditable}
                            placeholder="ex) 보유 기술, 사용 언어, 자기소개 등\n다양한 내용을 입력하세요"
                            style={styles.modal_resume_title_input} value={modalResumeData.title}/>
                        </View>
                        <View style={styles.modal_resume_content}>
                            <Text style={{marginLeft:3, marginBottom:3}}>내용</Text>
                            <TextInput editable={isEditable} 
                            placeholder="ex) 블로그, GitHub 등"
                            style={styles.modal_resume_input} value={modalResumeData.content}/>
                        </View>
                        <View style={styles.modal_resume_url}>
                            <Text style={{marginLeft:3,marginBottom:3}}>URL 링크</Text>
                            <TextInput editable={isEditable} 
                            style={styles.modal_resume_input} value={modalResumeData.url}/>
                        </View>
                        <View style={{flex: 0.6}}></View>
                    </View>
                </Modal>
                
                ):( undefined )}
            </View>
        </View>
    )
}

const ResumeItem = ({ title, createDate, id, getResumeList, setModalVisible, setModalResumeData }) => {
    const date = new Date(createDate);
    const currentDate = new Date();
    const currentYear = date.getFullYear();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const vintageDate = `${year}.${month}.${day}`
    const formattedDate = `${month}월 ${day}일 ${hours}:${minutes}`

    const resumeDelete = async(id) => {
        try{
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            axios.delete(`${API_URL}/api/auth/resume/${id}`, {
                headers: {Authorization: `Bearer ${token.token}`}
            })
            .then(res => {
                const result = res.data.data;
                Alert.alert('안내', result);
                getResumeList();
            })
            .catch(err=>{
                Alert.alert('경고', err);
                getResumeList();
            })
        } catch (error) {
            console.log(error);
        }
    }
    const resumeDetail = async(id) => {
        try{
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            axios.get(`${API_URL}/api/auth/resume/${id}`, {
                headers: {
                    Authorization: `Bearer ${token.token}`,
                }
            })
            .then(res => {
                const result = res.data.data;
                setModalResumeData({
                    title : result.title,
                    content : result.content,
                    url: result.url,
                    createDate: result.createDate,
                    id: result.id,
                })
                setModalVisible(true);
            })
            .catch(err=>{
                Alert.alert('경고', '문제가 발생했습니다.');
            })
        } catch (error){
            console.log(error);
        }
    }
    return (
        <View style={[styles.resume_item, {height:hp('18%'), padding:hp('2%')}]}>
        <TouchableOpacity style={{flex:1, justifyContent:'space-between'}} onPress={()=>{resumeDetail(id)}}>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: hp('1%')}}>
                <Text style={{fontSize:23, justifyContent:'space-between'}}>{title}</Text>
                <View style={{alignItems: 'center'}}>
                    <Text style={{fontSize: 13}}>최종 수정일</Text>
                    <Text style={{fontSize: 11}}>{currentYear>year ? vintageDate : formattedDate}</Text>
                </View>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                <TouchableOpacity style={[styles.resume_button, {height:hp('5%')}]}>
                    <Text>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.resume_button, {height:hp('5%')}]}
                onPress={() => {resumeDelete(id)}}>
                    <Text>삭제</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    notice_container: {
        flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    },
    resume_container: {
        flex: 7,
    },
    resume_item_container: {
    },
    resume_add_button: {
        backgroundColor:'white', height:hp('7%'), alignItems:'center', justifyContent:'center', marginHorizontal: '25%', borderRadius:30, borderWidth: 1,
    },
    resume_item: {
        borderRadius: 10,
        backgroundColor:'#A6BFFF'
    },
    resume_button: {
        borderWidth: 1,
        borderRadius: 14,
        flex:1,
        justifyContent: 'center', alignItems: 'center',
        marginHorizontal:'3%',
        backgroundColor:'white'
    },
    modal_container_android:{
        backgroundColor:'white',
        elevation: 7,
        height: '100%',
        borderRadius: 30, 
        marginTop: '18%', 
        marginBottom: '-10%',
        padding:'8%',
        position:'absolute',
    },
    modal_container_ios:{
        backgroundColor:'white',
        shadowOffset: {height: '-1%'},
        shadowOpacity: 0.7,
        shadowColor: 'black',
        height: '100%',
        borderRadius: 30, 
        marginTop: '18%', 
        marginBottom: '-10%',
        position:'absolute',
        padding:'8%',
    },
    modal_view:{
        flex: 1,
        margin: 30,
        borderWidth: 1,
    },
    modal_resume_buttons: {
        flex:0.3,
        flexDirection: 'row',
        justifyContent:'flex-end',
        alignItems: 'center',
    },
    resume_button_android: {
        elevation: 3,
        borderRadius: 13,
        padding: 7, marginLeft: 8
    },
    resume_button_ios: {
        shadowOffset: {height: 2, width: 1},
        shadowOpacity: 0.7,
        shadowColor: 'black',
        elevation: 3,
        borderRadius: 13,
        padding: 7, marginLeft: 8
    },
    modal_resume_title: {
        flex:0.6,
        justifyContent:'center',
        marginBottom: 15,
    },
    modal_resume_content: {
        flex:2,
        marginBottom: 15,
    },
    modal_resume_url: {
        flex:0.5,
    },
    modal_resume_title_input:{
        borderBottomWidth: 1, color: 'black', fontSize: 35,
    },
    modal_resume_input: {
        flex:1, paddingLeft: 16, paddingTop:16, textAlignVertical:'top',
        borderWidth: 1, borderRadius: 10, color: 'black', fontSize: 18
    },
})