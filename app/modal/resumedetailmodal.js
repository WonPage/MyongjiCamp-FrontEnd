import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ResumeDetailModal({navigation, title, data}){
    console.log(data);
    return (
        <View style={{flex:1, justifyContent:'space-between', alignItems:'center'}}>
            <View>
                <Text style={{fontSize:24}}>{title}</Text>
            </View>
            <View>
                <Text>{`profileIcon : ${data.icon}`}</Text>
                <Text>{`nickname : ${data.nickname}`}</Text>
                <Text>{`Role : ${data.role}`}</Text>
                <Text>{`Content : ${data.applyContent}`}</Text>
                <Text>{`URL : ${data.applyUrl}`}</Text>
            </View>
            <View>
                <Pressable onPress={navigation.goBack}>
                    <Text>확인</Text>
                </Pressable>
            </View>
        </View>
    )
}