import { Pressable, StyleSheet, Text, View } from "react-native";
import DefaultLayout from "../../layout/keyboardlayout";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthLayout from "../../layout/authlayout";
import ModalLayout from "../../modal/modallayout";

export default function Apply({navigation, route}) {
    return (
        <AuthLayout navigation={navigation} route={route}>
            <View style={styles.container}>
                <StatusBar style="auto" />
                <Text>하이하이 어플라이임</Text>
                <Link href={'/'}></Link>

                {/* 이력서 상세보기 본인글만 볼 수 있음 */}
                <Pressable onPress={()=>(navigation.navigate('ModalLayout', {content:'MyAlert'}))}>
                    <Text>이거 눌러봐</Text>
                </Pressable>
            </View>
        </AuthLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});