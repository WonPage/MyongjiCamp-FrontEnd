import { Link } from "expo-router";
import {  StyleSheet, View } from "react-native";

export default function Login(){
    return (
        <View style ={styles.container}>
            <View style ={styles.icon}></View>
            <View style ={styles.login_input}></View>
            <View style={styles.login_checkBox}></View>
            <View style={styles.login_confirm}></View>
            <View style={styles.login_cant}></View>
            <View style={styles.app_tour}></View>
        </View>
    );
}
const styles = StyleSheet.create({
    container : {
        flex : 1,

        backgroundColor : 'red'
    },
    icon : {
        flex : 3,
        backgroundColor : 'red'
    },
    login_input : {
        flex : 2,
        backgroundColor : 'green'
    },
    login_checkBox : {
        flex : 0.5,
        backgroundColor : 'white'
    },
    login_confirm : {
        flex : 1.5,
        backgroundColor : 'red'
    },
    login_cant : {
        flex : 0.5,
        backgroundColor : 'green'
    },
    app_tour : {
        flex : 2,
        backgroundColor : 'white'
    }

});