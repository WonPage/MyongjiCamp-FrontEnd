import { Link } from "expo-router";
import { Text, StyleSheet, View } from "react-native";

export default function Home(){
    return (
        <View>
            <Text>Hello World!!!!</Text>
            <Link style={styles.text} href={'/screens/login'}>로그인 화면으로 이동</Link>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 28,
    },
});