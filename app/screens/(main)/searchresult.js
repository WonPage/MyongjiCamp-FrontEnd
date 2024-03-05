import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const API_URL = process.env.API_URL;
export default function SearchResult({navigation, route}){
    const [resultList, setResultList] = useState();

    const roles = route.params.roles;
    const keyword = route.params.keyword;
    const [pageNum, setPageNum] = useState(0);
    const [direction, setDirection] = useState('DESC');
    const [boardType, setBoardType] = useState('recruit');
    const [status, setStatus] = useState('ongoing'); 

    // axios.get으로 query를 담아서 보냄. 
    const searching = () => {
        const params = new URLSearchParams();
        const query = {
            'keyword' : keyword,
            'roles' : roles.map((tag)=>{
                switch (tag) {
                    case '백엔드': return 'BACK';
                    case '프론트엔드': return 'FRONT';
                    case '디자인': return 'DESIGN';
                    case 'AI': return 'AI';
                    case '풀스택': return 'FULL';
                    case 'ETC': return 'ETC';
                    case '기획': return 'PM';
                }
            }),
            'pageNum':pageNum,
            'direction':direction,
            'boardType':boardType,
            'status': (boardType === 'recruit' ? 'ongoing' : undefined)
        }
        params.append('keyword', query.keyword);
        params.append('roles', query.roles.join(','));
        params.append('pageNum', query.pageNum);
        params.append('direction', query.direction);
        params.append('boardType', query.boardType);
        params.append('status', query.status);

        console.log(params.toString());
        axios.get(`${API_URL}/api/board?${params.toString()}`)
        // axios.get(`http://192.168.89.73:8080/api/board?${params.toString()}`)
        .then(res => {
            const result = res.data;
            console.log('옴', result.data);
            setResultList(result.data);
        })
        .catch(error => {
            const result = error;
            // const result = error.response.data;
            console.log('실패', result);
        })
    }
    useEffect(()=>{
        searching();
    },[])
    const moveDetail = (boardId) => {
        // console.log(boardId);
        navigation.navigate('PostDetail', {title: '모집 중', boardId: boardId});
    }
    return (
        <View>
            <Text>{ keyword === '' ? ('검색어가 존재하지 않습니다.') : (`'${keyword}'에 대한 결과입니다.`)}</Text>
            <Text>{roles.map((tag)=>(`#${tag} `))}</Text>
            <View>
                {resultList ? resultList.map((item, index)=>(
                    <TouchableOpacity key={index} onPress={()=>{moveDetail(item.boardId)}}>
                        <View style={{ borderWidth: 1 }}>
                            <Text>{item.modifiedDate}</Text>
                            <Text>{item.roles}</Text>
                            <Text>{item.title}</Text>
                            <Text>{`스크랩 : ${item.scrapCount}`}</Text>
                        </View>
                    </TouchableOpacity>
                        )) : (<></>)}
            </View>
        </View>
    )   
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    result_item_container:{
        borderWidth: 1
    }
});