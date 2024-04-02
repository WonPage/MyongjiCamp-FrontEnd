import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import DefaultLayout from "../../layout/keyboardlayout";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthLayout from "../../layout/authlayout";
import ModalLayout from "../../modal/modallayout";

export default function Apply({navigation, route}) {
    return (
        <AuthLayout navigation={navigation} route={route}>
            <View style={styles.container}>
                <StatusBar style="auto" />
                <ScrollView>

                </ScrollView>
                <ScrollView>

                </ScrollView>
            </View>
        </AuthLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});