import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DefaultLayout from "../../layout/defaultlayout";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

export function NotificationIcon({navigation}) {
    return(
        <TouchableOpacity style={styles.notification_icon}
        onPress={()=>{navigation.navigate("Notification")}}>
            <Ionicons name="notifications-outline" size={30} color="black" />
        </TouchableOpacity>
    )
}

export default function Notification({navigation}) {
    return(
        <View>
            <Text>안뇽</Text>
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