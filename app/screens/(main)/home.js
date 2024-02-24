import { StyleSheet } from "react-native";
import DefaultLayout from "../../layout/defaultlayout";
import { Link } from "expo-router";

export default function Home() {
    return(
        <DefaultLayout>
            <Views style={styles.container}>
                <StatusBar style="auto"/>
                <Text>하이하이</Text>
                <Link href={'/'}></Link>
            </Views>
        </DefaultLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});