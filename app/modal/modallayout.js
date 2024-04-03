import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import MyAlert from "./myalert";
import { useEffect, useState } from "react";
import SelectAlert from "./selectalert";
import ApplyModal from "./applymodal";
import ResumeDetailModal from "./resumedetailmodal";
import ResumeListModal from "./resumelistmodal";
import ReceivedResumeDetailModal from "./receivedresumedetailmodal";

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
                setMode(<SelectAlert afterAction={route.params.afterAction} navigation={navigation} title={title} message={message} action={route.params.action} data={route.params.data}/>);
                setModeStyle(styles.select_container);
                break;
            }
            case 'ApplyModal' : {
                setMode(<ApplyModal navigation={navigation} title={title} message={message} data={route.params.data}/>);
                setModeStyle(styles.apply_container);
                break;
            }
            case 'ReportReasonSelector' : {
                setMode(<ReportReasonSelector navigation={navigation}/>);
                setModeStyle(styles.report_selector_contaier);
                break;
            }
            case 'ResumeDetail' : {
                setMode(<ResumeDetailModal navigation={navigation} title={title} data={route.params.data}/>);
                setModeStyle(styles.resume_detail_container);
                break;
            }
            case 'ReceivedResumeDetail' : {
                setMode(<ReceivedResumeDetailModal navigation={navigation} title={title} data={route.params.data}/>);
                setModeStyle(styles.received_resume_detail_container);
                break;
            }
            case 'ResumeList' : {
                setMode(<ResumeListModal navigation={navigation} data={route.params.data}/>)
                setModeStyle(styles.resume_list_container);
                break;
            }
        }
    },[])
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
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
    },
    apply_container:{
        width: '85%',backgroundColor: 'white', borderRadius: 30,
        elevation:10   
    },
    report_selector_contaier:{
        width: '85%', height: '60%', backgroundColor: 'white', borderRadius: 30,
        elevation:10 
    },
    resume_detail_container:{
        width: '85%', height: '60%', backgroundColor: 'white', borderRadius: 30,
        elevation:10 
    },
    received_resume_detail_container: {
        width: '85%', backgroundColor: 'white', borderRadius: 30,
        elevation:10 
    },
    resume_list_container:{
        width: '90%',  backgroundColor: 'lightgray', borderRadius: 13,
        elevation:10
    },
})