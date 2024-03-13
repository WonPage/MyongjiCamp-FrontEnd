import { Pressable, Text, TextInput, View } from "react-native";
import KeyboardLayout from "../../layout/keyboardlayout";
import { StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
export default function HomeSearch({navigation, route}) {
    const moveSearchPage = () => {
        navigation.navigate('Search');
    }
    return (
        <Pressable style={[styles.search_container, {height:hp('7%'), marginTop:hp('2%'), marginBottom:hp('1%')}]} onPress={moveSearchPage}>
            <Text style={styles.search_input}>검색창</Text>
            <Feather style={styles.search_icon} name="search" size={24} color="#eff3f6" />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    search_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 30,
        borderRadius: 30,
        backgroundColor: '#6699CC',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    search_input: {
        flex:1, 
        color: '#eff3f6',
        borderColor:'#eff3f6',
        borderBottomWidth: 1,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 20,
        paddingBottom:2,
    },
    search_icon: {
    }
});