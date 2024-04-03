import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import useApply from "../hook/useapply";

export default function ResumeListModal({ navigation, data }) {
    const {getResumeDetail} = useApply();
    const iconPath = {
        1 : require('../../assets/icon/profile-icon-1.png'),
        2 : require('../../assets/icon/profile-icon-2.png'),
        3 : require('../../assets/icon/profile-icon-3.png'),
        4 : require('../../assets/icon/profile-icon-4.png'),
        5 : require('../../assets/icon/profile-icon-5.png'),
    }
    const handleShowResume = async(resumeId) => {
        await getResumeDetail(resumeId)
        .then(res => {
            // console.log(res.data);
            navigation.goBack();
            navigation.navigate('ModalLayout', {component:'ReceivedResumeDetail', title:'받은 이력서', data:{data:res.data, boardId:data.boardId}});
        })
    }
    return (
        <View style={{alignItems:'center', paddingVertical:hp('2%')}}>
            {data?.data.map((value, index) => {
                return (
                <TouchableOpacity onPress={()=>handleShowResume(value.applicationId)} activeOpacity={0.6} key={index} style={{marginVertical:hp('1%'), paddingHorizontal:'3%',
                    backgroundColor:'white', height:hp('8%'), justifyContent:'center', width:'90%'}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems:'center'}}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Image style={{borderRadius:50, height:hp('5%'), width:hp('5%'), marginRight:'7%'}} source={iconPath[value.icon]}/>
                            <View>
                                <Text style={{fontSize:23}}>{value.nickname}</Text>
                                <Text style={{fontSize:12}}>{value.role}</Text>
                            </View>
                        </View>
                        <View style={{marginRight:'2%'}}>
                            <MaterialCommunityIcons name="email-outline" size={30} color="gray" />
                            {/* <MaterialCommunityIcons name="email-open-outline" size={30} color="black" /> */}
                        </View>
                    </View>
                </TouchableOpacity>
            )})}
        </View>
    )
}

