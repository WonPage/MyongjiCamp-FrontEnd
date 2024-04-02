import { Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DefaultLayout from "../../layout/keyboardlayout";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import AuthLayout from "../../layout/authlayout";
import axios from "axios";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import KeyboardLayout from "../../layout/keyboardlayout";
import { Octicons, SimpleLineIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
export default function MyPage({navigation, route}) {
    const iconPath = {
        1 : require('../../../assets/icon/profile-icon-1.png'),
        2 : require('../../../assets/icon/profile-icon-2.png'),
        3 : require('../../../assets/icon/profile-icon-3.png'),
        4 : require('../../../assets/icon/profile-icon-4.png'),
        5 : require('../../../assets/icon/profile-icon-5.png'),
    }
    const [userData, setUserData] = useState();
    const [nicknameModalVisible, setNicknameModalVisible] = useState(false);
    const [newNickname, setNewNickname] = useState('');
    const getProfile = async() => {
        try{
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            axios.get(`${EXPO_PUBLIC_API_URL}/api/auth/profile`, {
                headers: {Authorization: `Bearer ${token.token}`}
            })
            .then(res =>{
                const result = res.data.data;
                setUserData(result);
                setIcon(res.data.data.profileIcon);
                setNewNickname(res.data.data.nickname);
            })
            .catch(err=>{
                // console.log('여기다 바보야', err)
            })
        }catch(err) {
            console.log(err)
        }
    }
    const nicknameChange = async() => {
        console.log(newNickname);
        try{
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            axios.put(`${EXPO_PUBLIC_API_URL}/api/auth/nickname/update`, {
                nickname:newNickname,
            },{
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${token.token}`
                }
            })
            .then(res =>{
                const result = res.data.data;
                getProfile();
                setNicknameModalVisible(false);
                // navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message:result})
            })
            .catch(err => {
                // console.log(err);
            })
        }catch(err) {console.log(err)}
    }
    const page_list = [
        {page:'Notice', title:'공지사항'},
        {page:'FAQ', title:'FAQ'},
        {page:'Event', title:'이벤트'},
        {page:'Information', title:'이용안내'},
        {page:'NotifySetting', title:'알림설정'},
        {page:'PwChange', title: '비밀번호 변경'},
        {page:'Logout', title:'로그아웃'}
    ]
    const profileIcons = [
        {id: 1, name: 'red', image: require('../../../assets/icon/profile-icon-1.png')},
        {id: 2, name: 'green', image: require('../../../assets/icon/profile-icon-2.png')},
        {id: 3, name: 'blue', image: require('../../../assets/icon/profile-icon-3.png')},
        {id: 4, name: 'purple', image: require('../../../assets/icon/profile-icon-4.png')},
        {id: 5, name: 'pink', image: require('../../../assets/icon/profile-icon-5.png')},
    ]
    const [icon, setIcon] = useState();
    const profileChange = async(iconId) => {
        // console.log(iconId, userData?.profileIcon);
        if (userData?.profileIcon === iconId) {
            return;
        }
        try{
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            axios.put(`${EXPO_PUBLIC_API_URL}/api/auth/icon/update`, {
                profileIcon:iconId,
            },{
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${token.token}`
                }
            })
            .then(async(res) =>{
                // console.log(res.data);
/*                 const newToken = res.data.data.token;
                const newTokenData = {
                    userId: token.userId,
                    token: newToken,
                    refresh: token.refresh,
                    session: (token.session ? true : undefined),
                    tokenExp: token.tokenExp,
                    refreshExp: token.refreshExp,
                }
                // AsyncStorage.clear();
                await AsyncStorage.mergeItem('token', JSON.stringify(newTokenData)); */
                getProfile();
                // navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message:result})
            })
            .catch(err => {
                console.log(err.response.data);
            })
            .then(()=>{
            })
        } catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        getProfile();
    },[])
    return(
        <AuthLayout navigation={navigation} route={route}>
        <View style={[styles.container]}>
            <StatusBar style="auto"/>
            <View style={styles.profile_container}>
                <View>
                    <View style={{justifyContent:'center', alignItems:'center', width:hp('15%'), height:hp('15%'), marginLeft:hp('0.5%'), marginRight:hp('2%')}}>
                        {/* <Image source={profileIcon.image} style={{borderRadius:100, width:hp('20%'), height:hp('20%')}}/> */}
                        <Picker
                        selectedValue={icon}
                        style={{width:'100%', height:'100%', opacity:0, position:'absolute'}}
                        onValueChange={(iconId) => {
                            // console.log(iconId);
                            profileChange(iconId);
                        }}>
                        {profileIcons.map((icon, index) => (
                            <Picker.Item key={index} label={icon.name} value={icon.id} />
                        ))}
                        </Picker>
                        <Image style={{borderRadius: 50}} source={iconPath[icon?icon:undefined]}/>
                    </View>
                </View>
                <View>
                    <TouchableOpacity onPress={()=>{
                        setNicknameModalVisible(true);
                    }} style={{marginBottom:hp('0.5%'), flexDirection:'row', alignItems:"center"}}>
                        <Text style={{fontSize: 30}}>{userData?.nickname}</Text>
                        <Octicons style={{marginLeft:5}} name="pencil" size={18} color="black" />
                    </TouchableOpacity>
                    <Text style={{fontSize: 15}}>{userData?.email}</Text>
                </View>
            </View>
            <View style={styles.resume_container}>
                <View style={{flex: 1}}></View>
                <View style={{flex: 5}}>
                <TouchableOpacity style={styles.resume_button} onPress={()=>{navigation.navigate('Resume')}}>
                    <Text style={{fontSize: 20}}>이력서 관리</Text>
                </TouchableOpacity>
                </View>
                <View style={{flex: 1}}></View>
            </View>
            <View style={styles.pages_container}>
                <FlatList
                style={{marginTop: 22}}
                contentContainerStyle= {{paddingVertical: 10, paddingHorizontal:34, alignItems: 'flex-start', paddingBottom:-7}}
                data={page_list}
                renderItem={({item}) => <Item title={item.title} page={item.page} navigation={navigation}/>}
                />
            </View>
            {/* 닉네임 변경 Modal */}
            <Modal
            animationType="fade" visible={nicknameModalVisible}
            onRequestClose={()=>setNicknameModalVisible(false)} transparent={true}>
                <Pressable style={{height:'100%', backgroundColor:'rgba(0, 0, 0, 0.4)'}} onPress={()=>setNicknameModalVisible(false)}/>
                <View style={{borderRadius:30, position:'absolute', height:hp('43%'), width:'75%', marginLeft:'12%', marginTop:'45%', backgroundColor:'white',}}>
                    <KeyboardLayout>
                    <View style={{flex:1, padding:'10%'}}>
                        <Text style={{fontSize:28, textAlign:'center', marginTop:'10%'}}>닉네임 변경</Text>
                        <TextInput value={newNickname} onChangeText={(text)=>setNewNickname(text)}
                        style={{borderWidth:1, height:hp('8%'), marginTop:'10%', borderRadius:20, paddingHorizontal:16}}/>
                        <View style={{alignItems:'center', marginTop:'20%'}}>
                            <TouchableOpacity style={{borderRadius:40,backgroundColor:'skyblue', height:hp('10%'),alignItems:'center', justifyContent:'center',
                            paddingHorizontal: hp('2%')}} onPress={()=>nicknameChange()}>
                                <Text>중복 확인 및 변경</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </KeyboardLayout>
                </View>
            </Modal>
        </View>
        </AuthLayout>
    )
}
const Item = ({title, page, navigation}) => {
    if (page === 'Logout') {
        return (
            <TouchableOpacity style={styles.page_item} onPress={async()=>{
                const token = JSON.parse(await AsyncStorage.getItem('token'));
                // console.log(token);
                axios.post(`${EXPO_PUBLIC_API_URL}/api/auth/logout`, {}, {
                    headers:{'Content-Type':'application/json', Authorization: `Bearer ${token.token}`}
                })
                .then(res => {
                    AsyncStorage.clear();
                    const data = res.data;
                    console.log('Logout :', data);
                    navigation.reset({
                        index: 0,
                        routes: [{name: 'Login'}],
                    });
                })
                .catch(err => {
                    console.log(err);
                })
            }}>
                <Text style={styles.page_title}>{title}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <TouchableOpacity style={styles.page_item} onPress={()=>{navigation.navigate(page)}}>
            <Text style={styles.page_title}>{title}</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profile_container:{
        flex: 2.5,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal:'8%'
    },
    resume_container:{
        flex: 0.8,
        flexDirection: 'row',
    },
    resume_button:{
        width:'100%', height:'100%', borderRadius: 10,
        backgroundColor: 'skyblue',
        justifyContent: 'center', alignItems:'center',
    },
    pages_container:{
        flex: 4,
    },
    page_item :{ marginBottom: 27,},
    page_title: {fontSize: 23}
});