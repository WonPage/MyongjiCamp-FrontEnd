import { Alert, BackHandler, FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DefaultLayout from "../../layout/keyboardlayout";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";
import AuthLayout from "../../layout/authlayout";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { usePOST } from "../../hook/useaxios";
import { FontAwesome6 } from "@expo/vector-icons";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function PostButton({navigation, route}){
    return (
    <></>
    )
}

export function PostSend(){
    return(
        <TouchableOpacity onPress={()=>{postWrite()}}>
            <Text style={{fontSize: 17, marginRight: 12}}>작성</Text>
        </TouchableOpacity>
    )
}

function RoleItem({roleData, setRoleData, setViewHeight}){
    const inputRefs = useRef([]);
    const inputRefs2 = useRef([]);
    const handleNumberChange = (type, index, value) => {
        setRoleData((prevState) =>
          prevState.map((v, i) => {
            if (i === index) {
              return {
                ...v,
                [type]: ( value === '' ? '' : parseInt(value)),
              };
            }
            return v;
          })
        );
      };
      const handleNext = (index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].focus();
        }
      };
      const handleNext2 = (index) => {
        if (inputRefs2.current[index]) {
          inputRefs2.current[index].focus();
        }
      };
      const handleRoleDelete = (index) => {
        const updatedRoleData = [...roleData];
        updatedRoleData.splice(index, 1);
        setRoleData(updatedRoleData);
        setViewHeight(prev=>prev-8);
      };
    return (
        <>
        {roleData.map((value, index) => {
            if (index<1) {
                return (
                    <View style={[styles.role_item, {height:hp('8%')}]} key={index}>
                         <Picker
                            style={styles.role_picker}
                            selectedValue={value.role}
                            onValueChange={(itemValue, itemIndex) => { setRoleData((prev) => {
                                return prev.map((v, i) => {
                                    if (i === index) { return { ...v, role: itemValue }}
                                    return v;
                                });
                            })}}>
                            <Picker.Item style={styles.picker_item} label="프론트엔드" value={'FRONT'} />
                            <Picker.Item style={styles.picker_item} label="백엔드" value={'BACK'} />
                            <Picker.Item style={styles.picker_item} label="AI" value={'AI'} />
                            <Picker.Item style={styles.picker_item} label="디자인" value={'DESIGN'} />
                            <Picker.Item style={styles.picker_item} label="풀스택" value={'FULL'} />
                            <Picker.Item style={styles.picker_item} label="기획" value={'PM'} />
                            <Picker.Item style={styles.picker_item} label="ETC" value={'ETC'} />
                        </Picker> 
                        <View style={styles.role_number_container}>
                            <TextInput 
                            // autoFocus={index>0 ? true : undefined}
                            ref={(ref) => (inputRefs2.current[index] = ref)}
                            style={styles.role_input} placeholder="0" value={value.appliedNumber.toString()}
                            maxLength={1} keyboardType='number-pad' returnKeyType="next"
                            onChangeText={(text) => handleNumberChange('appliedNumber', index, text)}
                            onSubmitEditing={() => handleNext(index)}/>
                            <TextInput 
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={styles.role_input} placeholder="0" value={value.requiredNumber.toString()}
                            maxLength={1} keyboardType='number-pad'
                            onChangeText={(text) => handleNumberChange('requiredNumber', index, text)}
                            onSubmitEditing={() => handleNext2(index+1)}/>
                        </View>
                        <TouchableOpacity style={styles.role_delete} activeOpacity={0.7}>
                            <FontAwesome6 name="trash-can" size={20} color="lightgray" />
                        </TouchableOpacity>
                    </View>
                )
            } else {
                return (
                <View style={[styles.role_item, {height:hp('8%')}]} key={index}>
                    <Picker
                       style={styles.role_picker}
                       selectedValue={value.role}
                       onValueChange={(itemValue, itemIndex) => { setRoleData((prev) => {
                           return prev.map((v, i) => {
                               if (i === index) {
                                   return { ...v, role: itemValue }
                               }
                               return v;
                           });
                       })}}>
                       <Picker.Item style={styles.picker_item} label="프론트엔드" value={'FRONT'} />
                       <Picker.Item style={styles.picker_item} label="백엔드" value={'BACK'} />
                       <Picker.Item style={styles.picker_item} label="AI" value={'AI'} />
                       <Picker.Item style={styles.picker_item} label="디자인" value={'DESIGN'} />
                       <Picker.Item style={styles.picker_item} label="풀스택" value={'FULL'} />
                       <Picker.Item style={styles.picker_item} label="기획" value={'PM'} />
                       <Picker.Item style={styles.picker_item} label="ETC" value={'ETC'} />
                    </Picker> 
                    <View style={styles.role_number_container}>
                       <TextInput 
                       // autoFocus={index>0 ? true : undefined}
                       ref={(ref) => (inputRefs2.current[index] = ref)}
                       style={styles.role_input} placeholder="0" value={value.appliedNumber.toString()}
                       maxLength={1} keyboardType='number-pad' returnKeyType="next"
                       onChangeText={(text) => handleNumberChange('appliedNumber', index, text)}
                       onSubmitEditing={() => handleNext(index)}/>
                       <TextInput 
                       ref={(ref) => (inputRefs.current[index] = ref)}
                       style={styles.role_input} placeholder="0" value={value.requiredNumber.toString()}
                       maxLength={1} keyboardType='number-pad'
                       onChangeText={(text) => handleNumberChange('requiredNumber', index, text)}
                       onSubmitEditing={() => handleNext2(index+1)}/>
                    </View>
                    <TouchableOpacity style={styles.role_delete} activeOpacity={0.6} onPress={()=>handleRoleDelete(index)}>
                        <FontAwesome6 name="trash-can" size={20} color="black" />
                    </TouchableOpacity>
               </View>
                )
            }
        })}        
        </>
    )
}

export default function Post({navigation, route}) {
    // useEffect(()=>{
    //     const backHandler = BackHandler.addEventListener('hardwareBackPress', navigation.goBack)
    //     return () => backHandler.remove();
    // },[])
    const [viewHeight, setViewHeight] = useState(130);
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postLocation, setPostLocation] = useState('');
    const [postDuration, setPostDuration] = useState('');
    const [durationUnit, setDurationUnit] = useState('일'); 


    //백엔드에서 get으로 받아와서 set해줘야됨
    const [roleData, setRoleData] = useState([{role:'FRONT', appliedNumber:'', requiredNumber:''}]);

    const handleRoleAdd = () => {
        setViewHeight(prev=>prev+8)
        setRoleData([...roleData, {role:'FRONT', appliedNumber:"", requiredNumber:""}]);
    }

    const postWrite = async() => {
        if (postTitle.length < 1 || postContent.length < 1 || postLocation.length < 1 || postDuration.length < 1) {
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message:'빈칸을 채워주세요.'})
            // return Alert.alert('경고', '빈칸을 채워주세요.');
        }
    
        let roleCheck = new Set();
        roleData.map((role)=>roleCheck.add(role.role))
        if (roleCheck.size !== roleData.length) {
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message:'직무는 중복선택 할 수 없습니다.'})
        }

        let flag = false;
        let count = 0;
        roleData.map((value) => {
            if (value.appliedNumber > value.requiredNumber) {
                flag = true;
                return navigation.navigate('ModalLayout', { component: 'MyAlert', title: '안내', message: '현재인원은 필요인원보다 클 수 없습니다.' });
            }
            if (value.requiredNumber === '' || value.requiredNumber === 0){
                flag = true;
                return navigation.navigate('ModalLayout', { component: 'MyAlert', title: '안내', message: '필요인원은 0이 될 수 없습니다.' });
            }
            if (value.appliedNumber === ''){
                value.appliedNumber = 0;
            }
            if (value.requiredNumber === value.appliedNumber) {
                count += 1;
            }
        })
        if (!flag && roleData.length === count) {
            flag = true;
            return navigation.navigate('ModalLayout', { component: 'MyAlert', title: '안내', message: '모든 인원이 꽉 차 있습니다.' });
        }

        const postData = {
          title: postTitle,
          content: postContent,
          preferredLocation: postLocation,
          expectedDuration: `${postDuration}${durationUnit}`,
          roleAssignments : roleData,
        };
        
        // 안내문구 ( 정말 작성? )
        // navigation.navigate('ModalLayout', {component: 'SelectAlert', title:'안내', message:'정말 작성하시겠습니까?'});
        if (!flag) {
        try{
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            axios.post(`${API_URL}/api/auth/recruit`, postData, {
                headers : {
                    'Content-Type':'application/json',
                    Authorization: `Bearer ${token.token}`,
                }
            })
            .then(res => {
                const result = res.data.data;
                console.log(res.data);
                navigation.pop(); //나중에 바꿔줘야함
                navigation.navigate('ModalLayout', {component: 'MyAlert', title:'안내', message: result});
            })
            .catch(err => {
                const result = err.response.data;
                // navigation.navigate('ModalLayout', {component: 'MyAlert', title:'경고', message: result});
            })
            .then(()=>{
                
            })
        }catch(error){
            // console.log(error);
        }
        }
      };
    return (
        <AuthLayout navigation={navigation} route={route}>
            <ScrollView>
                <View style={[styles.container, {height: hp(`${viewHeight}%`)}]}>
                    <StatusBar style="auto" />
                    <View style={[styles.title_container, {height: hp('10%'), marginBottom: hp('3%')}]}>
                        <Text style={{ marginLeft: 3, marginBottom: 3 }}>제목 (최대 20자)</Text>
                        <TextInput
                            placeholder="제목"
                            maxLength={20}
                            style={styles.title_input} value={postTitle}
                            onChangeText={setPostTitle} />
                    </View>
                    <View style={[styles.content_container, {height: hp('42%'), marginBottom: hp('3%')}]}>
                        <Text style={{ marginLeft: 3, marginBottom: 3 }}>내용</Text>
                        <TextInput
                            maxLength={500}
                            multiline={true}
                            placeholder="ex) 구하고자 하는 팀원의 기술, 언어, 도구 등 다양한 내용을 작성해보세요."
                            style={styles.content_input_box} value={postContent}
                            onChangeText={setPostContent} />
                    </View>
                    <View style={[styles.role_container, {height: hp(`${viewHeight-102}%`), marginBottom: hp('3%')}]}>
                        <Text style={{ marginLeft: 3, marginBottom: 3 }}>필요 직무</Text>
                        <View style={styles.role_list_container}>
                            <View style={[styles.role_list_description, {marginTop:hp('1%')}]}>
                                <Text style={{fontSize: 12}}>현재인원 / 필요인원</Text>
                            </View>
                            <View style={styles.role_item_container}>
                                <RoleItem roleData={roleData} setRoleData={setRoleData} setViewHeight={setViewHeight} />
                            </View>
                            <TouchableOpacity 
                            style={[styles.role_add_button, {height: hp('6%'), marginTop: hp('2%'), display:(roleData.length>=7 ? 'none' : undefined)}]} onPress={handleRoleAdd}>
                                <Text>추가</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.location_container, {height: hp('10%'), marginBottom: hp('3%')}]}>
                        <Text style={{ marginLeft: 3, marginBottom: 3 }}>희망 지역 (최대 10글자)</Text>
                        <TextInput
                            maxLength={10}
                            placeholder="ex) 온라인, 명진당, 역북동 등.."
                            style={styles.location_input_box} value={postLocation}
                            onChangeText={setPostLocation} />
                    </View>
                    <View style={[styles.duration_container, {height: hp('10%'), marginBottom: hp('3%')}]}>
                        <Text style={{ marginLeft: 3, marginBottom: 3 }}>예상 기간</Text>
                        <View style={styles.duration_input_container}>
                            <TextInput
                                maxLength={3}
                                style={styles.input_bar} value={postDuration}
                                placeholder="0"
                                onChangeText={setPostDuration} keyboardType="number-pad" />
                            <Picker
                                style={styles.duration_picker}
                                selectedValue={durationUnit}
                                onValueChange={(itemValue, itemIndex) => setDurationUnit(itemValue)}>
                                <Picker.Item label="일" value={'일'} />
                                <Picker.Item label="주" value={'주'} />
                                <Picker.Item label="개월" value={'개월'} />
                            </Picker>
                        </View>
                    </View>

                    <View style={[styles.post_button_container, {height: hp('10%')}]}>
                        <TouchableOpacity onPress={postWrite}
                            style={styles.post_button}>
                            <Text>작성</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </AuthLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'white',
        padding: 20
    },
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
});