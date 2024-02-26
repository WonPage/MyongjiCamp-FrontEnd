import { Pressable, StyleSheet, Text, View } from "react-native";
import DefaultLayout from "../../layout/defaultlayout";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
    return(
        <DefaultLayout>
            <View style={styles.container}>
                <StatusBar style="auto"/>
                <Text>하이하이 홈임</Text>
                <Link href={'/'}></Link>
                <Pressable onPress={async()=>{
                    const token = JSON.parse(await AsyncStorage.getItem('token'));
                    if (token) {
                        console.log('토큰 있어요', token);
                    } else {
                        console.log('토큰 없어요...');
                    }
                }}><Text>토큰확인</Text></Pressable>

            </View>
        </DefaultLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});