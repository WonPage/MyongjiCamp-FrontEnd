import { StyleSheet, Text, View } from "react-native";
import DefaultLayout from "../../layout/defaultlayout";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function MyPage({navigation}) {
    return(
        <DefaultLayout>
            <View style={styles.container}>
                <StatusBar style="auto"/>
                <TouchableOpacity onPress={()=>{ navigation.reset({index:0, routes: [{name: 'Login'}]})}}>
                    <Text>로그아웃 (로그인페이지로)</Text>
                </TouchableOpacity>
            </View>
        </DefaultLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});