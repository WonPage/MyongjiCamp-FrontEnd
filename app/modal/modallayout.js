import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import MyAlert from "./myalert";
import { useEffect, useState } from "react";
import SelectAlert from "./selectalert";

export default function ModalLayout({navigation, route}) {
    const component = route.params.component;
    const title = route.params.title;
    const message = route.params.message;
    const [mode, setMode] = useState();
    const [modeStyle, setModeStyle] = useState();
    useEffect(()=>{
        switch(component){
            case 'MyAlert' : {
                setMode(<MyAlert navigation={navigation} title={title} message={message}/>);
                setModeStyle(styles.alert_container);
                break;
            };
            case 'SelectAlert' : {
                setMode(<SelectAlert navigation={navigation} title={title} message={message}/>);
                setModeStyle(styles.select_container);
                break;
            }
        }
    },[])
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent:'center', }}>
            <Pressable style={[StyleSheet.absoluteFill, styles.alert_background]}
                onPress={navigation.goBack} />
            <View style={modeStyle ? modeStyle : styles.modal_container}>
                {mode}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    alert_background: {
        backgroundColor:'rgba(0, 0, 0, 0.3)',
    },
    modal_container: { 
        width: '70%', height: '50%', backgroundColor: 'white', borderRadius: 30,
        elevation:10
    },
    alert_container:{
        width: '70%', height: '30%', backgroundColor: 'white', borderRadius: 30,
        elevation:10 
    },
    select_container:{
        width: '70%', height: '40%', backgroundColor: 'white', borderRadius: 30,
        elevation:10  
    }
})