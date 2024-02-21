import { Text, StyleSheet } from "react-native";

export default function Home(){
    return (
        <Text>Hello World!</Text>
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