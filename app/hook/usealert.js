import { useNavigation } from "@react-navigation/native";

export function useAlert({component='MyAlert', title='안내', message='메세지를 입력해주세요.'}){
    const navigation = useNavigation();
    // console.log(component, title, message)
    return () => navigation.navigate('ModalLayout', {component:component, title:title, message:message});
}