import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Pressable, StyleSheet, Text, View } from "react-native";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function SelectAlert({afterAction, navigation, title, message, action, data}){
    const handleAcceptAction = () => {
        switch (action) {
            case 'deletePost' : {
                deletePost(data.boardId, navigation);
                break;
            }
            case 'updatePost' : {
                updatePost(data.boardId, data.modalData, navigation)
                break;
            }
            case 'deleteComment' : {
                deleteComment(data.boardId, data.commentId, navigation);
                break;
            }
            case 'completeRecruit' : {
                completeRecruit(data.boardId, data.postData, navigation);
                break;
            }
        }
    }
    const handleCancleAction = () => {
        switch (action) {
            case 'deletePost' : {
                navigation.goBack();
                break;
            }
            case 'updatePost' : {
                //Modal Visible을 true로 만듦. (다시 수정화면으로 복귀)
                afterAction(true);
                navigation.goBack();
                break;
            }
            case 'deleteComment' : {
                navigation.goBack();
                break;
            }
            case 'completeRecruit' : {
                navigation.goBack();
                break;
            }
        }
    }
    return(
        <View style={{flex:1}}>
            <View style={styles.title_container}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.message_container}>
                <Text style={styles.message}>{message}</Text>
            </View>
            <View style={styles.button_container}>
                <Pressable onPress={handleCancleAction} style={styles.button}>
                    <Text style={styles.button_text}>취소</Text>
                </Pressable>
                <Pressable onPress={handleAcceptAction} style={styles.button}>
                    <Text style={styles.button_text}>확인</Text>
                </Pressable>
            </View>
        </View>
    )
}

const deletePost = async(boardId, navigation) => {
    try{
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        axios.delete(`${API_URL}/api/auth/recruit/${boardId}`, {
            headers: {Authorization: `Bearer ${token.token}` }
        })
        .then(res => {
            navigation.goBack();
            navigation.navigate('Root');
            const result = res.data;
            navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message:result.data});
        })
        .catch(err => {
            console.log('postdetail delete error:',err);
        })
    }catch (err) {console.log('token get err')};
}

const updatePost = async(boardId, modalData, navigation) => {
    try{
        // console.log(modalData);
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        axios.put(`${API_URL}/api/auth/recruit/${boardId}`, {
            title:modalData.title,
            content:modalData.content,
            status :modalData.status,
            preferredLocation:modalData.preferredLocation,
            expectedDuration:modalData.expectedDuration,
            roleAssignments:modalData.roleAssignments
        }, {
            headers : {
                'Content-Type':'application/json',
                Authorization: `Bearer ${token.token}`,
            }
        })
        .then(res => {
            console.log(res.data);
            const result = res.data;
            // setUpdateMode(false);
            navigation.goBack();
            navigation.navigate('Root');
            navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message: result.data});
        })
    }catch(err){console.log(err)};
}

const deleteComment = async(boardId, commentId, navigation) => {
    try{
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        axios.delete(`${API_URL}/api/auth/recruit/${boardId}/comment/${commentId}`, {
            headers: {Authorization: `Bearer ${token.token}` }
        })
        .then(res => {
            const result = res.data;
            navigation.goBack();
            navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message:result.data});
            // getComment().then((data)=>setCommentList(data));
        })
        .catch(err => {
            console.log('delete comment error:',err);
        })
    }catch (err) {console.log('token get err:')};
}

const completeRecruit = async(boardId, postData, navigation) => {
    try{
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        console.log(postData);
        const putData = {
            title: postData.title,
            content: postData.content,
            status: "RECRUIT_COMPLETE",
            preferredLocation: postData.preferredLocation,
            expectedDuration: postData.expectedDuration,
            roleAssignments: postData.roleAssignments
        }
        axios.put(`${API_URL}/api/auth/recruit/${boardId}`, putData, {
            headers: {
                'Content-Type':'application/json',
                Authorization: `Bearer ${token.token}`,
            }
        })
        .then(res => {
            const result = res.data;
            // console.log(result);
            navigation.goBack();
            navigation.navigate('Complete');
        })
    }catch(err){console.log}
}

const styles = StyleSheet.create({
    title_container:{flex: 1.5, alignItems: 'center',justifyContent: 'flex-end'},
    title:{fontSize: 30, fontWeight: '400'},
    message_container: {flex:2, padding: 10, alignItems:'center', justifyContent: 'center'},
    message:{ fontSize: 20},
    button_container:{flexDirection:'row', flex: 1.5, alignItems: 'center'},
    button:{backgroundColor:'lightblue', width:'50%', height:'70%', borderRadius: 40, justifyContent: 'center', alignItems:'center'},
    button_text:{fontSize:18}
})