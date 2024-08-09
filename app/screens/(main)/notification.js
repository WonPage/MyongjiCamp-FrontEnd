import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DefaultLayout from "../../layout/keyboardlayout";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
// import EventSource from "react-native-sse";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import RNEventSource from "react-native-event-source";
import { AppState } from "react-native";
import { parse } from "expo-linking";
const API_URL = process.env.API_URL;

export function NotificationIcon({navigation}) { //알림 아이콘
    return(
        <TouchableOpacity style={styles.notification_icon}
        onPress={()=>{navigation.navigate("Notification")}}>
            <Ionicons name="notifications-outline" size={30} color="black" />
        </TouchableOpacity>
    )
}
export default function Notification({navigation}) { // 페이지
    const [notifications, setNotifications] = useState([])
    const [appState, setAppState] = useState(AppState.currentState)

    const renderNotification = () => {
        return notifications.map((notification)=>{
            <View>
                <Text>새로운 댓글이 달렸습니다.</Text>
            </View>
        })
    } 

    return(
        <View>
            {/* {renderNotification()}  */}

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    notification_icon:{
        marginRight:18,
    }
}); 