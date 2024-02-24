import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DefaultLayout from "../../layout/defaultlayout";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from 'react';

export function PostButton({navigation}){
    return (
    <View></View>
    )
}

export default function Post() {
    return(
        <DefaultLayout>
            <View style={styles.container}>
                <StatusBar style="auto"/>
                <Text>하이하이 포스트임</Text>
                <Link href={'/'}></Link>
            </View>
        </DefaultLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});