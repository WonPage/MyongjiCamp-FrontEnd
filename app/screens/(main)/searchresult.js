import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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
        axios.get(`${process.env.API_URL}/api/board?${params.toString()}`)
        .then(res => {
            const result = res.data;
            console.log('옴', result.data);
            setResultList(result.data);
        })
        .catch(error => {
            const result = error.response.data;
            console.log('실패', result.data);
        })
    }
    useEffect(()=>{
        searching();
    },[])
    return (
        <View>
            <Text>{ keyword === '' ? ('검색어가 존재하지 않습니다.') : (`'${keyword}'에 대한 결과입니다.`)}</Text>
            <Text>{roles.map((tag)=>(`#${tag} `))}</Text>
            <View>
                {resultList ? resultList.reverse().map((result, index)=>(
                            <View key={index} style={styles.result_item_container}>
                                <Text>{result.modifiedDate}</Text>
                                <Text>{result.roles}</Text>
                                <Text>{result.title}</Text>
                                <Text>{`스크랩 : ${result.scrapCount}`}</Text>
                            </View>
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