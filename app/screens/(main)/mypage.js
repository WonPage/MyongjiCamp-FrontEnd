import { StyleSheet, Text, View } from "react-native";
import DefaultLayout from "../../layout/defaultlayout";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function MyPage() {
    return(
        <DefaultLayout>
            <View style={styles.container}>
                <StatusBar style="auto"/>
                <Text>하이하이 마이페이지</Text>
                <Link href={'/screens/(auth)/login'}>로그인 페이지로</Link>
            </View>
        </DefaultLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});