import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback } from "react-native";


/** 키보드가 View를 방해하지 않고, 키보드 밖을 터치하면 키보드가 해제됨 */
export default function DefaultLayout({children}){
    return (
        <KeyboardAvoidingView style={styles.layout}
            behavior={Platform.OS === "ios" ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                {children}
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    layout: {
        flex: 1
    }
})