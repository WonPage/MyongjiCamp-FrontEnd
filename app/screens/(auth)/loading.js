import { Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default function Loading({navigation}) {
    const checkSession = async() => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        if (token.session) {
            // console.log('세션 있어요');
            if (token.session) {
                navigation.reset({
                    index: 0,
                    routes: [{name: 'Root'}],
                });
            }
        } else{
            // console.log('세션 없어요');
            navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
            });
        }
    }
    useEffect(()=>{
        checkSession();
    }, [])
    return(
        <View style={styles.container}>
            <StatusBar style="auto"/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});