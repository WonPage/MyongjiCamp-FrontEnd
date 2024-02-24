import { Link } from "expo-router";
import { Text, StyleSheet, View } from "react-native";
import Navigation from "./navigation";

export default function Home(){
    return (
      <Navigation/>
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