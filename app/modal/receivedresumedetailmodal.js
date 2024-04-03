import { Image, Text, TouchableOpacity, View } from "react-native";
import useApply from "../hook/useapply";
import { MaterialIcons } from "@expo/vector-icons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function ReceivedResumeDetailModal({navigation, title, data}){
        const iconPath = {
            1 : require('../../assets/icon/profile-icon-1.png'),
            2 : require('../../assets/icon/profile-icon-2.png'),
            3 : require('../../assets/icon/profile-icon-3.png'),
            4 : require('../../assets/icon/profile-icon-4.png'),
            5 : require('../../assets/icon/profile-icon-5.png'),
        }
        const {getReceivedResumeList, resumeProcess} = useApply();
        const handleCloseModal = async() => {
                await getReceivedResumeList(data.boardId)
                .then(res => {
                        navigation.goBack();
                        navigation.navigate('ModalLayout', {component:'ResumeList', data:{data:res.data, boardId:data.boardId}});
                })
        }
        const handleAccept = async() => {
            // await resumeProcess('Accept', data.data.applicationId)
        }
        const handleReject = async() => {
            // await resumeProcess('Reject', data.data.applicationId)
        }
        return (
            <View style={{justifyContent:'space-between', alignItems:'center', padding:'6%'}}>
                <TouchableOpacity onPress={handleCloseModal} activeOpacity={0.5} style={{position:'absolute', top:'5%', left:'5%'}}>
                    <MaterialIcons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Image source={iconPath[data.data.icon]} style={{borderRadius:100, height:hp('4.5%'), width:hp('4.5%'), marginRight:'4%'}}/>
                        <Text style={{fontSize:25}}>{`${data.data.nickname}`}</Text>
                </View>
                <View style={{width:'100%'}}>
                    <View style={{marginTop:hp('2%')}}>
                        <Text>지원 직무</Text>
                        <View style={{borderWidth:1, borderRadius:8, justifyContent:'center', padding:16, marginTop:7}}>
                            <Text>{data.data.role}</Text>
                        </View>
                    </View>
                    <View style={{marginTop:hp('2%')}}>
                        <Text>내용</Text>
                        <View style={{borderWidth:1, borderRadius:8, justifyContent:'center', padding:16, marginTop:7}}>
                            <Text>{data.data.applyContent}</Text>
                        </View>
                    </View>
                    <View style={{marginTop:hp('2%')}}>
                        <Text>URL 링크</Text>
                        <View style={{borderWidth:1, borderRadius:8, justifyContent:'center', padding:16, marginTop:7}}>
                            <Text>{data.data.applyUrl}</Text>
                        </View>
                    </View>
                </View>
                <View style={{marginTop:hp('5%'), marginBottom:hp('2%'), flexDirection:'row', justifyContent:"space-evenly", width:'100%'}}>
                    <TouchableOpacity onPress={handleAccept}
                    style={{backgroundColor:'#008FD5', paddingVertical:'4%', paddingHorizontal:'10%', borderRadius:13}}>
                        <Text style={{color:'white', fontSize:18}}>승인</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleReject}
                    style={{backgroundColor:'lightgray', paddingVertical:'4%', paddingHorizontal:'10%', borderRadius:13}}>
                        <Text style={{fontSize:18}}>거절</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }