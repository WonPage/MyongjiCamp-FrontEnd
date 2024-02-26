import { Keyboard, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, TouchableWithoutFeedback, View } from "react-native";


/** 키보드가 View를 방해하지 않고, 키보드 밖을 터치하면 키보드가 해제됨 */
export default function DefaultLayout({children}){
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View style={styles.layout}>
            {/* behavior={Platform.OS === "ios" ? 'padding' : 'height'}> */}
                {children}
        </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
    }
})