import { Link } from "expo-router";
import { Text, StyleSheet, View, BackHandler, ToastAndroid, LogBox } from "react-native";
import Navigation from "./navigation";
import { useEffect, useRef } from "react";

export default function App(){
    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state'
    ])
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