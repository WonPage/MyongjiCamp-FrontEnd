import { Keyboard, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, TouchableWithoutFeedback, View } from "react-native";


/** 키보드가 View를 방해하지 않고, 키보드 밖을 터치하면 키보드가 해제됨 */
export default function KeyboardLayout({children}){
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
            {children}
        </TouchableWithoutFeedback>
    )
}