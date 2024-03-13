import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import KeyboardLayout from "../../layout/keyboardlayout";
import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
export default function Search({navigation, route}) {
    const tags = [
        {name:'프론트엔드', value:'FRONT'},
        {name:'백엔드', value:'BACK'},
        {name:'디자인', value:'DESIGN'},
        {name:'AI', value:'AI'},
        {name:'풀스택', value:'FULL'},
        {name:'ETC', value:'ETC'},
        {name:'기획', value:'PM'},
    ]
    const [searchWord, setSearchWord] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    const moveSearchResult = () => {
        if (searchWord.trim() === '' && selectedTags.length==0) {
            setSearchWord('');
            return navigation.navigate('ModalLayout', {component: 'MyAlert', title:'안내', message: '키워드를 입력해주세요.'});
        } 
        // console.log('Search :', searchWord, selectedTags);
        navigation.navigate('SearchResult', {
            keyword: searchWord,
            roles: selectedTags
        });
    }
    const handleTagSelect = (tag) => {
      const newSelectedTags = [...selectedTags];
      if (newSelectedTags.includes(tag)) {
        newSelectedTags.splice(newSelectedTags.indexOf(tag), 1);
      } else {
        newSelectedTags.push(tag);
      }
      setSelectedTags(newSelectedTags);
    };

    return (
        <KeyboardLayout>
            <View style={{ marginHorizontal: '5%', flex: 1, }}>
                <View style={[styles.search_container, {marginBottom:hp('3%')}]}>
                    <TextInput style={styles.search_input} placeholder="검색창"
                        value={searchWord} onChangeText={setSearchWord}
                        onSubmitEditing={moveSearchResult} autoFocus={true} />
                    <Pressable style={styles.search_icon} onPress={moveSearchResult}>
                        <Feather name="search" size={24} color="black" />
                    </Pressable>
                </View>
                <View style={styles.tag_container}>
                    {tags.map((tag) => (
                        <BouncyCheckbox
                            style={styles.tag_item}
                            key={tag.value} text={tag.name}
                            textStyle={{
                                textDecorationLine: "none",
                            }}
                            iconStyle={{
                                // display: 'none',
                            }}
                            textContainerStyle={{marginLeft:10}}
                            isChecked={selectedTags.includes(tag.name)}
                            onPress={() => handleTagSelect(tag.name)}
                        />)
                    )}
                </View>
            </View>
        </KeyboardLayout>
    )
}

const styles = StyleSheet.create({
    search_container: {
        marginVertical: '4%',
        height: '8%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 30,
        borderRadius: 30,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    search_input: {
        flex:1, 
        borderBottomWidth: 1,
        marginHorizontal: 10,
        fontSize: 20,
    },
    search_icon: {
    },
    tag_container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    tag_item:{        
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 7,
        paddingRight: 13,
        marginBottom: 10,
        backgroundColor: "#ffffff",
        marginRight: 10,
    },
});