import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SelectAlert({navigation, title, message}){
    return(
        <View style={{flex:1}}>
            <View style={styles.title_container}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.message_container}>
                <Text style={styles.message}>{message}</Text>
            </View>
            <View style={styles.button_container}>
                <Pressable onPress={navigation.goBack} style={styles.button}>
                    <Text style={styles.button_text}>취소</Text>
                </Pressable>
                <Pressable onPress={navigation.goBack} style={styles.button}>
                    <Text style={styles.button_text}>확인</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title_container:{flex: 1.5, alignItems: 'center',justifyContent: 'flex-end'},
    title:{fontSize: 30, fontWeight: '400'},
    message_container: {flex:2, padding: 10, alignItems:'center', justifyContent: 'center'},
    message:{ fontSize: 20},
    button_container:{flexDirection:'row', flex: 1.5, alignItems: 'center'},
    button:{backgroundColor:'lightblue', width:'50%', height:'70%', borderRadius: 40, justifyContent: 'center', alignItems:'center'},
    button_text:{fontSize:18}
})