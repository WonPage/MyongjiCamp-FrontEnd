import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BackHandler, Keyboard, Modal, Platform, Pressable, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { StatusBar, StyleSheet } from "react-native";
import { View } from "react-native";
import { useComment } from "../../hook/usecomment";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Loading from "../(other)/loading";
import { Image } from "react-native";
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import useReport from "../../hook/usereport";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function PostDetail({ navigation, route }) {
        const iconPath = {
        1 : require('../../../assets/icon/profile-icon-1.png'),
        2 : require('../../../assets/icon/profile-icon-2.png'),
        3 : require('../../../assets/icon/profile-icon-3.png'),
        4 : require('../../../assets/icon/profile-icon-4.png'),
        5 : require('../../../assets/icon/profile-icon-5.png'),
    }
    const boxRef = useRef();
    const scrollViewRef = useRef();
    const {getComment, writeComment} = useComment();
    const {postReport, commentReport} = useReport();
    const [commentList, setCommentList] = useState([]);
    const [updateMode, setUpdateMode] = useState(false);
    const [postData, setPostData] = useState();
    const [initialData, setInitialData] = useState({
        title:"",
        content:"",
        preferredLocation:"",
        expectedDuration:"",
        roleAssignments:[],
    });
    const [modalData, setModalData] = useState({
        title:"",
        content:"",
        preferredLocation:"",
        expectedDuration:"",
        roleAssignments:[],
    });
    const [roleData, setRoleData] = useState([]);
    const [isScrap, setIsScrap] = useState(false);
    const boardId = route.params.boardId;
    const [userId, setUserId] = useState();
    const [replyMode, setReplyMode] = useState(false);
    const [replyId, setReplyId] = useState();
    const [replyNickname, setReplyNickname] = useState();
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const getPostDetail = async() => {
        try{
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            axios.get(`${API_URL}/api/auth/recruit/${boardId}`, {
                headers: {Authorization: `Bearer ${token.token}` }
            })
            .then(res => {
                setUserId(token.userId);
                setPostData(res.data.data);
            })
            .catch(err => {
                console.log('postdetail error:',err);
            })
        }catch (err) {console.log('token get err:')};

        try{
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            axios.get(`${API_URL}/api/auth/scrap/${boardId}`, {
                headers: {
                    Authorization: `Bearer ${token.token}`,
                }
            })
            .then(res => {
                // console.log(res.data.data);
                setIsScrap(res.data.data);
            })
            // .catch(console.log);
        }
        catch (err) {
            // console.log(err);
        }
    }
    const handleModalChange = (type, value) => {
        setModalData(prevState => ({...prevState, [type]:value}));
    };
    const handleNumberChange = (type, index, value) => {
        setRoleData((prevState) => {
            return prevState.map((v,i)=>{
                if (i === index) {
                    return { ...v, [type]: (value === '' ? '' : parseInt(value))};
                } return v;
            });
        });
    };
    const handleUpdatePost = () => {
        let flag = false;
        roleData.map((value) => {
            if (value.appliedNumber > value.requiredNumber) {
                setUpdateMode(false);
                flag = true;
                return navigation.navigate('ModalLayout', { component: 'MyAlert', title: '안내', message: '현재인원은 필요인원보다 클 수 없습니다.' });
            }
            if (value.requiredNumber === '' || value.requiredNumber === 0){
                setUpdateMode(false);
                flag = true;
                return navigation.navigate('ModalLayout', { component: 'MyAlert', title: '안내', message: '필요인원은 0이 될 수 없습니다.' });
            }
        })
        if (initialData.roleAssignments === roleData && initialData.title === modalData.title && initialData.content === modalData.content && initialData.expectedDuration === (duration.num + duration.unit) && initialData.preferredLocation === modalData.preferredLocation) {
            navigation.goBack();
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message:'수정된 정보가 없습니다.'})
        }
        if (!flag){
            setUpdateMode(false);
            navigation.navigate('ModalLayout', {component:'SelectAlert', title:'안내', message:'게시물을 수정하시겠습니까?', action:'updatePost', data:{boardId:boardId,modalData:{
                title:modalData.title,
                content:modalData.content,
                status : "RECRUIT_ONGOING",
                preferredLocation:modalData.preferredLocation,
                expectedDuration:duration.num + duration.unit,
                roleAssignments:roleData
            }},afterAction:setUpdateMode});

        }
    }
    useEffect(()=>{
        getPostDetail();
        const refresh = navigation.addListener('focus', getPostDetail);
        return refresh;
    },[]);
    const [duration, setDuration] = useState({});
    const handleDurationChange = (type, value) => {
        setDuration(prevState => ({...prevState, [type]:value}));
    };
    const handleReply = (commentId, commentUserNickname) => {
        setReplyMode(true);
        setReplyId(commentId);
        setReplyNickname(commentUserNickname);
        boxRef.current.focus();
    }
    const handleReplyModeCancle = () => {
        if (replyMode){
            // console.log('취소');
            Keyboard.dismiss();
            setReplyMode(false);
            setReplyId(null);
            setReplyNickname(null);
            setTimeout(() => {
                ToastAndroid.show('대댓글이 취소되었습니다.', ToastAndroid.SHORT);
            }, 5);
        }
    }

    const [targetId, setTargetId] = useState();
    const [reportType, setReportType] = useState();
    const handlePostReport = async(boardId, reason) => {
        const data = {
            targetType: 'Post',
            reporterId: userId,
            targetId: boardId,
            reason: reason,
        }
        const result = await postReport(data);
        navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message:result.data})
    }
    /*     ADVERTISEMENT //광고
    ,ABUSE //욕설 및 비방
    ,ILLEGAL_CONTENT //불법 정보
    ,HATE_SPEECH //혐오 발언
    //,유해성 내용
    ,OTHER //기타 */
    const handleCommentReport = async(commentId, reason) => {
        const data = {
            targetType: 'Comment',
            reporterId: userId,
            targetId: commentId,
            reason: reason
        }
        const result = await commentReport(data);
        navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message:result.data})
    }
    return (
        <View style={styles.container}>
            <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={commentList ? {backgroundColor: 'white'} : { backgroundColor: 'white', ssflex: 1 }} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
                <Pressable onPress={handleReplyModeCancle}>
                <StatusBar style="auto" />
                <Detail setReportType={setReportType} setReportModalVisible={setReportModalVisible} setTargetId={setTargetId} userId={userId} setDuration={setDuration} iconPath={iconPath} boardId={boardId} postData={postData} isScrap={isScrap} getPostDetail={getPostDetail} setUpdateMode={setUpdateMode} setModalData={setModalData} setRoleData={setRoleData} setInitialData={setInitialData}/>
                <Comment setReportType={setReportType} setReportModalVisible={setReportModalVisible} setTargetId={setTargetId} writerId={postData?.writerId} userId={userId} iconPath={iconPath} boardId={boardId} getComment={getComment} commentList={commentList} setCommentList={setCommentList} handleReply={handleReply} scrollViewRef={scrollViewRef} />
                <ReportModal reportType={reportType} visible={reportModalVisible} onClose={()=>{setReportModalVisible(false)}} handleCommentReport={handleCommentReport} handlePostReport={handlePostReport} targetId={targetId}/>
                </Pressable>
            </ScrollView>
            <CommentPush getComment={getComment} writeComment={writeComment} setCommentList={setCommentList} boxRef={boxRef} scrollViewRef={scrollViewRef}
            replyNickname={replyNickname} setReplyNickname={setReplyNickname} replyId={replyId} setReplyId={setReplyId} replyMode={replyMode} setReplyMode={setReplyMode}/>
            <Modal
                animationType="slide"
                visible={updateMode}
                onRequestClose={()=>setUpdateMode(false)}
                transparent={true}>
                {/* <Pressable style={{flex:1, backgroundColor:'transparent'}} onPress={()=>setUpdateMode(false)}/> */}
                <View style={styles.modal_container}>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity onPress={()=>setUpdateMode(false)} style={{position:'absolute', left:0}}>
                            <AntDesign name="close" size={24} color="black"/>
                        </TouchableOpacity>
                        <Text style={{fontSize: 20}}>게시글 수정</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{marginBottom:hp('2%'), marginTop:hp('4%')}}>
                            <Text style={{fontSize:13, marginBottom:5, marginLeft:5}}>제목</Text>
                            <TextInput style={{borderWidth:1, height:hp('8%'), paddingHorizontal:hp('2%'), borderRadius:15,}}
                            placeholder="제목" maxLength={20}
                            value={modalData?.title} onChangeText={(text)=>handleModalChange('title', text)}/>
                        </View>
                        <View style={{marginBottom:hp('2%')}}>
                            <Text style={{fontSize:13, marginBottom:5, marginLeft:5}}>내용</Text>
                            <TextInput style={{borderWidth:1, height:hp('30%'), padding:hp('2%'), borderRadius:15, 
                            textAlignVertical:'top'}} multiline={true} maxLength={500} placeholder="ex) 구하고자 하는 팀원의 기술, 언어, 도구 등 다양한 내용을 작성해보세요."
                            value={modalData?.content} onChangeText={(text)=>handleModalChange('content', text)}/>
                        </View>
                        <View style={{marginBottom:hp('2%')}}>
                            <Text style={{fontSize:13, marginBottom:5, marginLeft:5}}>희망 지역</Text>
                            <TextInput style={{borderWidth:1, height:hp('8%'), paddingHorizontal:hp('2%'), borderRadius:15}}
                            maxLength={10} placeholder="ex) 온라인, 명진당, 역북동 등.."
                            value={modalData?.preferredLocation} onChangeText={(text)=>handleModalChange('preferredLocation', text)}/>
                        </View>
                        <View style={{marginBottom:hp('2%')}}>
                            <Text style={{fontSize:13, marginBottom:5, marginLeft:5}}>예상 기간</Text>
                            <View style={{flexDirection:'row', borderWidth:1, height:hp('8%'), paddingHorizontal:hp('2%'), borderRadius:15}} >
                                <TextInput style={{width:'30%'}}
                                maxLength={3} placeholder="0" keyboardType='number-pad'
                                value={duration?.num} onChangeText={(text)=>handleDurationChange('num', text)}/>
                                <Picker
                                    style={{width:'70%'}}
                                    selectedValue={duration.unit}
                                    onValueChange={(itemValue, itemIndex) => handleDurationChange('unit', itemValue)}>
                                    <Picker.Item label="일" value={'일'} />
                                    <Picker.Item label="주" value={'주'} />
                                    <Picker.Item label="개월" value={'개월'} />
                                </Picker>
                            </View>
                        </View>
                        <View>
                            <View style={{flexDirection:'row', alignItems:'baseline', justifyContent:'space-between'}}>
                                <Text style={{fontSize:13, marginBottom:5, marginLeft:5}}>직무</Text>
                                <Text style={{fontSize:11, marginBottom:5, marginRight:8}}>(현재인원 / 필요인원)</Text>
                            </View>
                            <View style={{borderWidth:1, height:hp('25%'), padding:hp('2%'), borderRadius:15}}>
                                {roleData?.map((role,index)=>(
                                    <View key={index} style={{ height:hp('8%') , backgroundColor:'yellow', flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
                                        {/* <Text>{role.role}</Text> */}
                                        <Picker
                                            style={{flex:1}}
                                            selectedValue={role.role}
                                            onValueChange={(itemValue, itemIndex) => { setRoleData((prev) => {
                                                return prev.map((v, i) => {
                                                    if (i === index) { return { ...v, role: itemValue }}
                                                    return v;
                                                });
                                            })}}>
                                            <Picker.Item label="프론트엔드" value={'FRONT'} />
                                            <Picker.Item label="백엔드" value={'BACK'} />
                                            <Picker.Item label="AI" value={'AI'} />
                                            <Picker.Item label="디자인" value={'DESIGN'} />
                                            <Picker.Item label="풀스택" value={'FULL'} />
                                            <Picker.Item label="기획" value={'PM'} />
                                            <Picker.Item label="ETC" value={'ETC'} />
                                        </Picker> 
                                        <View style={{ flexDirection: 'row', alignItems:'center' }}>
                                            <TextInput style={{borderBottomWidth:1, textAlign:'center'}} value={role.appliedNumber.toString()}
                                            onChangeText={(text)=>handleNumberChange('appliedNumber', index, text)}
                                            maxLength={1} keyboardType='number-pad' returnKeyType="next" />
                                            <Text>/</Text>
                                            <TextInput style={{borderBottomWidth:1, textAlign:'center'}} value={role.requiredNumber.toString()} 
                                            onChangeText={(text)=>handleNumberChange('requiredNumber', index, text)}
                                            maxLength={1} keyboardType='number-pad' />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View style={{justifyContent:'center', alignItems:'center'}}>
                            <TouchableOpacity onPress={handleUpdatePost} style={{backgroundColor:'lightblue',
                        marginVertical:hp('5%'), paddingVertical:hp('2.5%'), paddingHorizontal:hp('5%'), borderRadius:20}}>
                                <Text style={{color:'white', fontSize:18, fontWeight:'500'}}>수정 완료</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    )
}

function ReportModal({reportType, visible, onClose, handleCommentReport, handlePostReport, targetId}) {
    const reportOptions = [
        'ADVERTISEMENT', //광고
        'ABUSE', //욕설 및 비방
        'ILLEGAL_CONTENT', //불법 정보
        'HATE_SPEECH', //혐오 발언
        'OTHER' //기타
    ];
    const [reason, setReason] = useState(null);
    const handleReport = () => {
        if (reportType === 'Post') handlePostReport(targetId, reason);
        if (reportType === 'Comment') handleCommentReport(targetId, reason);
        onClose();
    };
    return (
    <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'white', width:'80%' ,borderRadius: 3, elevation:10, padding:16}}>
                        <View>
                            <Text style={{fontSize:15, marginBottom:hp('2%')}}>{`신고 사유 : ${reason===null ? "보기 중 하나를 선택하세요." : 
                            reason==='ADVERTISEMENT' ? "광고" :
                            reason==='ABUSE' ? '욕설 및 비방' :
                            reason=== 'ILLEGAL_CONTENT' ? '불법 정보' :
                            reason=== 'HATE_SPEECH' ? '혐오 발언' : '기타'}`}</Text>
                        </View>
                        <View>
                            {reportOptions.map((option, index) => (
                                <TouchableOpacity style={{backgroundColor:'lightgray', borderRadius:5, margin:'1%',
                                justifyContent:'center', alignItems:'center', height:hp('6%')}} key={index} onPress={() => setReason(option)}>
                                        <Text style={{fontSize:20, fontWeight:'500'}}>{option === 'ADVERTISEMENT' ? '광고' :
                                        option === 'ABUSE' ? '욕설 및 비방' :
                                        option === 'ILLEGAL_CONTENT' ? '불법 정보' :
                                        option === 'HATE_SPEECH' ? '혐오 발언' : '기타'}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop:hp('3%')}}>
                            <TouchableOpacity style={{marginRight:'8%'}} onPress={onClose}>
                                <Text>취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={reason===null ? true : false} onPress={handleReport}>
                                <Text>신고</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            </View>
    </Modal>
    )
}

function Detail({setReportType, setReportModalVisible, setTargetId, userId, setDuration, iconPath, boardId, postData, isScrap, getPostDetail, setUpdateMode, setModalData, setRoleData, setInitialData}) {
    const navigation = useNavigation();
    const handleScrap = async() => {
        try{
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            // console.log(token);
            axios.post(`${API_URL}/api/auth/scrap/${boardId}`, {}, {
                headers: {
                    'Content-Type':'application/json',
                    Authorization: `Bearer ${token.token}`,
                }
            })
            .then(res => {
                const result = res.data.data;
                console.log(result);
                getPostDetail();
                ToastAndroid.show(result, ToastAndroid.SHORT);
                // navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message:result});
            })
            .catch(err => {
                console.log(err);
            })
        }catch(err) {console.log(err)}
    }
    const handleRecruitComplete = async() => {
        const postDataList = postData.roleAssignments.filter(role=>role.appliedNumber>0);
        // let flag = false;
        // postData.roleAssignments.map((role) => {
        //     if (role.appliedNumber !== 0){
        //         flag = true;
        //     }
        // })
        if (postDataList.length === 0){
            return navigation.navigate('ModalLayout', {component: 'MyAlert', title:'안내', message:'모집된 인원이 한 명도 없습니다.'});
        }
        console.log(postDataList);
        navigation.navigate('ModalLayout', {component:'SelectAlert', title:'안내', message:'모집을 마감하시겠습니까? 현재인원으로 모집이 마감되며 모집완료 카테고리로 이동합니다. ', action:'completeRecruit', data:{boardId:boardId,postData:{
            title: postData.title,
            content: postData.content,
            status: "RECRUIT_COMPLETE",
            preferredLocation: postData.preferredLocation,
            expectedDuration: postData.expectedDuration,
            roleAssignments: postDataList
        }}})
    }
    const handleApply = () => {
        navigation.navigate('ModalLayout', {component:'ApplyModal', title:'지원', message:'지원할 직무와 이력서를 선택해주세요.',
        data: {boardId:boardId, role:postData.roleAssignments}})
    }
    //수정된 날짜가 더 크면 (수정됨) 같은거 붙여줘야하나? 기본적으로 모든 날짜는 수정된 날짜만 보여줘도됨
    const date = new Date(postData?.modifiedDate);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60 )); 
    const currentYear = currentDate.getFullYear();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const newMonth = month.toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const dateFormat = `${year}.${newMonth}.${day} ${hours}:${minutes}`
    // 기간을 숫자부분, 기간단위 부분으로 나눔
    const duration = {num : postData?.expectedDuration.replace(/[^0-9]/g, ""), unit : postData?.expectedDuration.replace(/[0-9]/g, "")};
    // useEffect(()=>{console.log(postData)},[])
    return (
        <View style={postData? {marginHorizontal: hp('3%'), marginTop: hp('4%')} : {height:hp('80%')}}>
            {postData ? (
                <View>
                    <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems:'center'}} >
                            <Image source={iconPath[postData?.profileIcon]} style={{marginRight:hp('1.4%'), borderRadius:50, height:hp('4%'), width:hp('4%')}}/>
                            <Text style={{marginRight:hp('1%')}}>{postData?.nickname}</Text>
                            <Text style={{fontSize:12, color:'gray'}}>{ postData?.modifiedDate === postData?.createDate ? dateFormat : `${dateFormat} (수정됨)`}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems:'center'}}>
                            { postData?.writerId === userId ? (<>
                                <TouchableOpacity onPress={()=>{
                                    setInitialData(postData);
                                    setModalData(postData);
                                    setRoleData(postData?.roleAssignments);
                                    setDuration(duration);
                                    setUpdateMode(true);
                                }}>
                                    <Text>수정</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{
                                    navigation.navigate('ModalLayout', {component: 'SelectAlert', title:'안내', message:'정말로 삭제하시겠습니까?', action:'deletePost', data:{boardId:boardId}})
                                }}>
                                    <Text style={{marginLeft:hp('1.5%')}}>삭제</Text>
                                </TouchableOpacity>
                            </>) : (
                                <TouchableOpacity onPress={()=>{
                                    setTargetId(boardId);
                                    setReportType('Post');
                                    setReportModalVisible(true);
                                    }}>
                                    <Text>신고</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize:23, marginTop: hp('2%')}}>{postData?.title}</Text>
                    </View>
                    <View style={{marginTop:hp('1%'), padding:hp('1%'), minHeight:hp('15%')}}>
                        <Text>{postData?.content}</Text>
                    </View>
                    <View style={{borderWidth:1, borderRadius:15, marginTop:hp('1%'), marginBottom:hp('4%'), padding:hp('2.5%')}}>
                        <View style={{marginBottom: hp('2%'), flexDirection:'row', alignItems:'baseline', justifyContent:'space-between'}}>
                            <Text style={{fontSize:16, fontWeight:'500'}}>선호 지역</Text>
                            <Text>{postData?.preferredLocation}</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'baseline', justifyContent:'space-between'}}>
                            <Text style={{fontSize:16, fontWeight:'500'}}>예상 기간</Text>
                            <Text>{postData?.expectedDuration}</Text>
                        </View>
                    </View>
                    <View style={{backgroundColor:'gray', borderRadius:15, paddingHorizontal:hp('3%'), paddingVertical:hp('0.5%')}}>
                        {postData?.roleAssignments.map((role, index) => (
                            <View key={index} style={{flexDirection:'row', justifyContent: 'space-between', paddingVertical:hp('2%')}}>
                                <Text>{role.role === 'BACK' ? ('백엔드') :
                                role.role === 'FRONT' ? ('프론트엔드') :
                                role.role === 'DESIGN' ? ('디자인') :
                                role.role === 'FULL' ? ('풀스택') :
                                role.role === 'PM' ? ('기획') : (role.role)}</Text>
                                <View style={{flexDirection:'row'}}>
                                    <Text>{role.appliedNumber}</Text>
                                    <Text>/</Text>
                                    <Text>{role.requiredNumber}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        {postData?.writerId === userId ? (
                            <TouchableOpacity onPress={handleRecruitComplete}
                            activeOpacity={0.7} style={{ marginTop: hp('6%'), backgroundColor: 'lightgray', width: '70%', height: hp('7%'), justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 17 }}>모집 마감하기</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={handleApply}
                            activeOpacity={0.7} style={{marginTop:hp('6%'), backgroundColor:'lightgray', width:'70%', height:hp('7%'), justifyContent:'center', alignItems:'center'}}>
                                <Text style={{fontSize:17}}>지원하기</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop:hp('4%'), marginBottom:hp('1.5%'), marginRight:hp('1%')}}>
                        <Entypo name="share" size={29} color="gray" />
                        <TouchableOpacity activeOpacity={0.6} onPress={handleScrap} style={{marginLeft:'5%'}} >
                            <FontAwesome name="bookmark-o" size={29} color={isScrap ? '#ffca1a' : 'gray'}  />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : <Loading/> }
        </View>
    )
}

function Comment({setReportType, setReportModalVisible, setTargetId, writerId, userId, iconPath, boardId, getComment, commentList, setCommentList, handleReply}) {
    const navigation = useNavigation();
    useEffect(()=>{
        getComment().then((data)=>{setCommentList(data);});
        const refresh = navigation.addListener('focus', ()=>{getComment().then((data)=>setCommentList(data))});
        return refresh;
    },[])
    return (
        <View style={ commentList ? {borderTopWidth: 2, marginHorizontal: hp('3%'), paddingVertical:hp('1%')} : {borderTopWidth: 2, marginHorizontal: hp('3%'),flex:1}}>
            {commentList.length !== 0 ? commentList.map((comment, index) => {
                const date = new Date(comment.commentCreateDate);
                const currentDate = new Date();
                const diffTime = Math.abs(currentDate - date);
                const diffHours = Math.floor(diffTime / (1000 * 60 * 60 )); 
                const currentYear = currentDate.getFullYear();
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const longFormat = `${year}.${month}.${day}`
                const nowFormat = `${hours}:${minutes}`
                return (
                <View key={index}>
                    <View style={{  borderRadius: 15, padding: 7, marginTop:5,marginBottom:-8}}>
                        <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between', marginLeft:'2%', marginRight:'3%', marginTop:hp('0.5%')}}>
                            <View style={{flexDirection:'row', alignItems: 'center'}}>
                                {/* <Image source={require(`../../../assets/icon/profile-icon-${comment.profileIcon}.png`)}/> */}
                                <Image source={iconPath[comment.profileIcon]} style={{borderRadius:50, width:hp('3.5%'),height:hp('3.5%'), marginRight: hp('1%')}}/>
                                <Text style={{marginRight:hp('1.5%'), fontWeight:'500'}}>{comment.nickname}</Text>
                                <Text style={{color: 'gray', fontSize:12}}>{diffHours < 24 ? nowFormat : longFormat}</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                { // 사용자가 댓글 작성자인 경우
                                userId === comment.writerId ? (<>
                                    <TouchableOpacity onPress={() => handleReply(comment.id, comment.nickname)}>
                                        <Text style={{ fontSize: 13 }}>댓글</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={async () => {
                                        navigation.navigate('ModalLayout', { component: 'SelectAlert', title: '안내', message: '정말로 삭제하시겠습니까?', action: 'deleteComment', data: { boardId: boardId, commentId: comment.id } });
                                    }}>
                                        <Text style={{ fontSize: 13, marginLeft: hp('1%') }}>삭제</Text>
                                    </TouchableOpacity>
                                </>) :
                                // 사용자가 게시글 작성자인 경우
                                userId === writerId ? (<>
                                    <TouchableOpacity onPress={()=>handleReply(comment.id, comment.nickname)}>
                                        <Text style={{fontSize:13}}>댓글</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{
                                        setTargetId(comment.id);
                                        setReportType('Comment');
                                        setReportModalVisible(true);
                                        }}>
                                        <Text style={{fontSize:13, marginLeft:hp('1%')}}>신고</Text>
                                    </TouchableOpacity>
                                </>): comment.isSecret === 1 ? (<>
                                    <TouchableOpacity onPress={()=>handleReply(comment.id, comment.nickname)}>
                                        <Text style={{fontSize:13}}>댓글</Text>
                                    </TouchableOpacity>
                                </>) : (<>
                                    <TouchableOpacity onPress={()=>handleReply(comment.id, comment.nickname)}>
                                        <Text style={{fontSize:13}}>댓글</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{
                                        setTargetId(comment.id);
                                        setReportType('Comment');
                                        setReportModalVisible(true);
                                        }}>
                                        <Text style={{fontSize:13, marginLeft:hp('1%')}}>신고</Text>
                                    </TouchableOpacity>
                                </>)}
                            </View>
                        </View>
                        {userId === comment.writerId || userId === writerId || comment.isSecret === 0 ? (
                            <Text style={{margin: hp('1%')}}>{comment.content}</Text>
                        ) : (
                            <Text style={{margin: hp('1%'), color:"#BBBBBB"}}>비밀 댓글입니다.</Text>
                        )}
                    </View>
                    { comment.children.map((comment, index) => (
                        <View key={index} style={{flexDirection:'row', alignItems:'flex-start', marginTop:hp('1%'),}}>
                            <Feather style={{marginLeft:'5%', marginTop:hp('1%')}} name="corner-down-right" size={20} color="black" />
                            <View style={{backgroundColor:'#F0F1F2', borderRadius:15,  padding: 5, marginLeft:'3%', flex:1}}>
                                <View key={index} style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between', marginLeft:'2%', marginRight:'4%', marginTop:hp('0.5%')}}>
                                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                                        {/* <Image source={require(`../../../assets/icon/profile-icon-${comment.profileIcon}.png`)}/> */}
                                        <Image source={iconPath[comment.profileIcon]} style={{borderRadius:50, width:hp('3.5%'),height:hp('3.5%'), marginRight: hp('1%')}}/>
                                        <Text style={{marginRight:hp('1.5%'), fontWeight:'500'}}>{comment.nickname}</Text>
                                        <Text style={{color: 'gray', fontSize:12}}>{diffHours < 24 ? nowFormat : longFormat}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        { //사용자가 댓글 작성자 일 때 
                                        userId === comment.writerId ? (<>
                                            <TouchableOpacity onPress={async () => {
                                                navigation.navigate('ModalLayout', { component: 'SelectAlert', title: '안내', message: '정말로 삭제하시겠습니까?', action: 'deleteComment', data: { boardId: boardId, commentId: comment.id } });
                                            }}>
                                                <Text style={{ fontSize: 13, marginLeft: hp('1%') }}>삭제</Text>
                                            </TouchableOpacity>
                                        </>) : 
                                        // 사용자가 게시글 작성자 일 때
                                        userId === writerId ? (<>
                                            <TouchableOpacity onPress={()=>{
                                            setTargetId(comment.id);
                                            setReportType('Comment');
                                            setReportModalVisible(true);
                                            }}>
                                                <Text style={{fontSize:13, marginLeft:hp('1%')}}>신고</Text>
                                            </TouchableOpacity>
                                        </>): 
                                        // 댓글이 비밀댓글이면 (그 외 사용자에게 사용)
                                        comment.isSecret === 1 ? (<>
                                        </>
                                        ) : 
                                        // 댓글이 공개댓글이면 (그 외 사용자에게 사용)
                                        (<>
                                            <TouchableOpacity onPress={()=>{
                                            setTargetId(comment.id);
                                            setReportType('Comment');
                                            setReportModalVisible(true);
                                            }}>
                                                <Text style={{fontSize:13, marginLeft:hp('1%')}}>신고</Text>
                                            </TouchableOpacity>
                                        </>)}
                                    </View>
                                </View>
                                { // 사용자가 댓글 작성자거나 게시글 작성자이거나 비밀댓글이 아닌 경우
                                userId === comment.writerId || userId === writerId || comment.isSecret === 0 ? (
                                    <Text style={{margin: hp('1%')}}>{comment.content}</Text>
                                ) : 
                                // 댓글이 비밀댓글인지 (비밀댓글이면서 댓글,게시글 작성자도 아님)
                                (
                                    <Text style={{margin: hp('1%'), color:"#BBBBBB"}}>비밀 댓글입니다.</Text>
                                )}
                            </View>    
                        </View>
                    ))}
                </View>
            )}) : (
            <View style={{marginVertical:hp('1%'), justifyContent:'center', alignItems:'center', backgroundColor:'lightgray', borderRadius:15, height:hp('10%')}}>
                <Text style={{fontSize:16, color:'gray'}}>댓글이 존재하지 않습니다.</Text>
            </View>
            )}
        </View>
    )
}

const CommentPush = ({getComment, writeComment, setCommentList, boxRef, scrollViewRef, replyNickname, setReplyNickname, replyId, setReplyId, replyMode, setReplyMode}) => {
    const [comment, setComment] = useState('');
    const [isSecret, setIsSecret] = useState(false);
    const handleCommentSubmit = () => {
        writeComment(comment, (replyMode===true?1:0), isSecret, (replyId?replyId:undefined))
        .then(()=>{
            getComment().then((data) => setCommentList(data)); // 댓글 작성 후 목록 다시 불러옴
            setComment(''); // 댓글 작성 후 입력창 초기화
            setReplyMode(undefined);
            setReplyId(undefined);
            setReplyNickname(undefined);
        })
        .catch((error) => {
            console.error('댓글 작성 오류:', error)
        })
        .then(() => {
            scrollViewRef.current.scrollToEnd({ animated: true });
        })
    }
    useEffect(()=>{
        setComment('');
    },[replyMode])
    return (
        <>
        {replyMode ? (
                <View style={[styles.comment_push_container]}>
                    <BouncyCheckbox
                        text="비밀" innerIconStyle={{ borderRadius: 3, width: 17, height: 17 }} iconStyle={{ borderRadius: 3, width: 20, height: 20 }}
                        textStyle={{ textDecorationLine: 'none', fontSize: 12 }} textContainerStyle={{ marginLeft: 6, marginRight: 6 }}
                        isChecked={isSecret}
                        onPress={() => setIsSecret(!isSecret)} />
                    <TextInput style={{ padding: 16, fontSize: 16, height: hp('7%'), flex: 6, backgroundColor: 'lightgray', marginVertical: hp('1%'), borderRadius: 10, marginRight: 16 }}
                        value={comment} onChangeText={setComment} ref={boxRef} placeholder={replyMode ? `@${replyNickname}` : undefined} />
                    <Pressable onPress={handleCommentSubmit}
                        style={{ flex: 1, backgroundColor: '#002E66', marginVertical: hp('1%'), alignItems: 'center', justifyContent: 'center', height: hp('6%'), borderRadius: 8 , paddingHorizontal:'2%'}}>
                        <Text style={{ color: 'white' }}>대댓</Text>
                    </Pressable>
                </View>
            ) : (
                <View style={[styles.comment_push_container]}>
                    <BouncyCheckbox
                        text="비밀" innerIconStyle={{ borderRadius: 3, width: 17, height: 17 }} iconStyle={{ borderRadius: 3, width: 20, height: 20 }}
                        textStyle={{ textDecorationLine: 'none', fontSize: 12 }} textContainerStyle={{ marginLeft: 6, marginRight: 6 }}
                        isChecked={isSecret}
                        onPress={() => setIsSecret(!isSecret)} />
                    <TextInput style={{ padding: 16, fontSize: 16, height: hp('7%'), flex: 6, backgroundColor: 'lightgray', marginVertical: hp('1%'), borderRadius: 10, marginRight: 16 }}
                        value={comment} onChangeText={setComment} ref={boxRef} placeholder={replyMode ? `@${replyNickname}` : undefined} />
                    <Pressable onPress={handleCommentSubmit}
                        style={{ flex: 1, backgroundColor: '#002E66', marginVertical: hp('1%'), alignItems: 'center', justifyContent: 'center', height: hp('6%'), borderRadius: 8, paddingHorizontal:'2%' }}>
                        <Text style={{ color: 'white' }}>작성</Text>
                    </Pressable>
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {flex:1},
    comment_push_container: {
        borderWidth:2, borderColor:'gray', borderRadius: 20, paddingHorizontal:16, marginHorizontal: '1%', backgroundColor:'white',
        position: 'relative', bottom:0, flexDirection:'row', alignItems: 'center',},

    title_container: {
        justifyContent:'center',
    },
    title_input:{
        borderBottomWidth: 1, color: 'black', fontSize: 32,
    },
    content_container: {
    },
    role_container: {
    },
        role_list_container:{
            flex:1, borderWidth: 1, borderRadius:10, alignItems: 'center', padding: 10
        },
        role_list_description: {
            alignSelf:'stretch', flexDirection: 'row', justifyContent:'flex-end', marginBottom: 5, marginRight: 5
        },
        role_item_container:{
            alignSelf:'stretch',
            borderWidth: 1,
            borderRadius: 20,
        },
        role_item: {
            alignItems: 'center', justifyContent: 'space-between',
            flexDirection: 'row', marginHorizontal: '2%',
        },
        role_picker: {
            flex: 5,
            marginRight: '3%'
        },
        picker_item: {
            fontSize: 18
        },
        role_number_container: {
            marginRight: '6%',
            justifyContent:'center',
            flex: 2,
            flexDirection: 'row',
            backgroundColor: 'yellow',
            borderWidth: 1,
            borderRadius: 30,
        },
        role_input: {
            marginHorizontal: '5%',
            textAlign: 'center',
            fontSize: 15,
        },
        role_delete:{
            flex: 1,
        },
        role_add_button:{
            backgroundColor: 'yellow',
            borderRadius: 40,
            justifyContent: 'center', alignItems:'center',
            width: '50%',
        },
    location_container: {
        justifyContent:'center',
    },
    content_input_box: {
        flex:1,
        padding:16, textAlignVertical:'top',
        borderWidth: 1, borderRadius: 10, color: 'black', fontSize: 17,
    },
    location_input_box: {
        padding:13, borderWidth: 1, borderRadius: 10, color: 'black', fontSize: 17,
    },
    duration_container:{
    },
    duration_input_container:{
        flexDirection: 'row',
        width:'60%',
    },
    input_bar: {
        flex: 0.5,
        borderBottomWidth: 1,
        paddingHorizontal: 16,
    },
    duration_picker: {
        flex: 1.2
    },
    post_button_container: { alignItems: 'center', justifyContent:'center'},
    post_button: {borderRadius: 20, backgroundColor: 'skyblue', width: '50%', height:'60%', alignItems: 'center', justifyContent: 'center' }

    ,
    modal_container:{
        backgroundColor:'white',
        height: '100%',
        padding:'8%',
        // position:'absolute',
        width:'100%'
    },
})