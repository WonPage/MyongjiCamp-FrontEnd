import { StyleSheet, Text, View } from "react-native";
import DefaultLayout from "../../layout/defaultlayout";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Scrap() {
    return(
        <DefaultLayout>
            <View style={styles.container}>
                <StatusBar style="auto"/>
                <Text>하이하이 스크랩임</Text>
                <Link href={'/'}></Link>
            </View>
        </DefaultLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});