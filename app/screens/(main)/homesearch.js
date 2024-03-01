import { Pressable, Text, TextInput, View } from "react-native";
import KeyboardLayout from "../../layout/keyboardlayout";
import { StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

export default function HomeSearch({navigation, route}) {
    const moveSearchPage = () => {
        navigation.navigate('Search');
    }
    return (
        <Pressable style={styles.search_container} onPress={moveSearchPage}>
            <Text style={styles.search_input}>검색창</Text>
            <Feather style={styles.search_icon} name="search" size={24} color="black" />
        </Pressable>
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
        color: 'gray',
        borderBottomWidth: 1,
        marginHorizontal: 10,
        fontSize: 20,
    },
    search_icon: {
    }
});