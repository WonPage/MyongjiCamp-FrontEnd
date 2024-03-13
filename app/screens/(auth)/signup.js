import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Text, StyleSheet, View, Image, TextInput, Alert, Pressable, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Dimensions, Platform, TouchableOpacity, Animated } from "react-native";
import * as Progress from 'react-native-progress';
import DefaultLayout from "../../layout/keyboardlayout";
import axios from "axios";
import KeyboardLayout from "../../layout/keyboardlayout";
import { Picker } from "@react-native-picker/picker";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
const API_URL = process.env.API_URL;
const Stack = createNativeStackNavigator();
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

export function Step1Screen({navigation}) {
    
    const inputRef = useRef();

    const regex = /^[a-zA-Z0-9]+$/
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isCodeEmpty, setIsCodeEmpty] = useState(true);
    const [isWrong, setIsWrong] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    // 4글자 인증번호를 채우지 않으면 확인이 활성화되지 않음.
    useEffect(()=>{
        if (code.length===4) setIsCodeEmpty(false);
        else setIsCodeEmpty(true); 

        if (isWrong){}
    }, [code, isWrong]);

    // 인증번호 타이머
    const [minutes, setMinutes] = useState(2);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isExpire, setIsExpire] = useState(false);
    function resetTimer() {
        setMinutes(2);
        setSeconds(1);
        setIsExpire(false);
        setIsActive(true);
    }
    useEffect(() => {
        let interval = null;
        if (isActive) {
          interval = setInterval(() => {
            if (seconds > 0) {
              setSeconds(seconds - 1);
            }
            if (seconds === 0) {
              if (minutes === 0) {
                setIsExpire(true);
                setIsActive(false);
                setCode('');
                clearInterval(interval);
              } else {
                setMinutes(minutes - 1);
                setSeconds(59);
              }
            } 
          }, 1000);
        } 
        return () => {
            clearInterval(interval);
        }
      }, [isActive, seconds]);
    

    const handleTextClick = () => {
        inputRef.current.focus();
    }
    const handleCodeSend = () => {
        setIsPressed(true);
        if (email === '') { // 이메일 빈칸인지 아닌지 확인
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'경고', message: '이메일을 입력해주세요.'});
            // return Alert.alert('경고', '이메일을 입력해주세요.');
        }
        if (!regex.test(email)) { // 한글, 특수문자 방지
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message: '영문, 숫자만 입력 가능합니다.'});
            // return Alert.alert('경고', '영문, 숫자만 입력 가능합니다.')
        }
        // **백엔드** 인증코드 보내기
        try{
            axios.post(`${API_URL}/api/email`, {email:`${email}@mju.ac.kr`}, {
                headers: {'Content-Length':'application/json'}
            })
            .then(res => {
                const result = res.data;
                console.log(res.data);
                setIsCodeSent(true);
                setIsActive(true);
                //성공 시
                navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message: '인증번호를 전송했습니다.\n약 10초 후 입력된 이메일을 통해 인증번호를 확인해보세요'});
                setIsPressed(false);
            })
            .catch(err=>{
                setIsPressed(false);
            })
        } catch(err){
            console.log(err);
        }
        // Alert.alert('안내', '인증번호를 전송했습니다.\n약 10초 후 입력된 이메일을 통해 인증번호를 확인해보세요.');
        //실패 시
        //return Alert.alert('오류', '전송에 실패하였습니다.');
    }
    const handleResendCode = () => {
        if (email === '') { // 이메일 빈칸인지 아닌지 확인
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'경고', message: '이메일을 입력해주세요.'});
            // return Alert.alert('경고', '이메일을 입력해주세요.');
        }
        if (!regex.test(email)) { // 한글, 특수문자 방지
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message: '영문, 숫자만 입력 가능합니다.'});
            // return Alert.alert('경고', '영문, 숫자만 입력 가능합니다.')
        }
        // **백엔드** 인증코드 보내기
        try{
            axios.post(`${API_URL}/api/email`, {email:`${email}@mju.ac.kr`}, {
                headers: {'Content-Length':'application/json'}
            })
            .then(res => {
                const result = res.data.data;
                console.log(result);
                setIsCodeSent(true);
                setIsActive(true);
                //성공 시
                navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message: '인증번호를 전송했습니다.\n약 10초 후 입력된 이메일을 통해 인증번호를 확인해보세요'});
            })
        } catch(err){
            console.log(err);
        }
        setCode('');
        //이메일 인증번호 재전송 코드
        resetTimer();
        navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message: '인증번호를 재전송했습니다.\n약 10초 후 입력된 이메일을 통해 인증번호를 확인해보세요.'});
        // Alert.alert('안내', '인증번호를 재전송했습니다.\n약 10초 후 입력된 이메일을 통해 인증번호를 확인해보세요.');
    }
    const handleVerifyCode = () => {
        try{
            axios.post(`${API_URL}/api/email/verify`,{email:`${email}@mju.ac.kr`, code:code}, {
                headers: {"Content-Type":'application/json'}
            })
            .then(res=>{
                const result = res.data;
                console.log(result);
                navigation.navigate('Step2', {
                    email: email, 
                });
                setIsWrong(false);
            })
            .catch(err => {
                setCode('');
                setIsWrong(true);
                navigation.navigate('ModalLayout', {component:'MyAlert', title:'경고', message: '인증번호가 일치하지 않습니다.'});
                // return Alert.alert('경고', '인증번호가 일치하지 않습니다.');
            })
        }catch(err){
            console.log(err);
        }
        // **백엔드** 코드가 우리가 보낸값과 일치하는지 확인
    }
    return (
        <>
            <Progress.Bar style={styles.progress} progress={0.33} width={SCREEN_WIDTH} height={10} animated={true} color={'#002E66'}/>
            <KeyboardLayout>
                <View style={styles.container}>
                    <StatusBar style='auto' />
                    <View style={styles.top_blank}></View>
                    <View style={styles.icon_container}>
                        <Image
                            style={styles.myongji_icon}
                            source={require('../../../assets/myongjicamp-title.png')} />
                    </View>
                    <View style={styles.text_container}>
                        <Text style={styles.text}>학교 인증을 완료해주세요.</Text>
                    </View>
                    <View style={styles.email_container}>
                        <View style={styles.email_box}>
                            <TextInput
                                ref={inputRef}
                                style={styles.email_value}
                                placeholder="이메일"
                                placeholderTextColor={"gray"}
                                value={email}
                                onChangeText={setEmail}
                                maxLength={30}
                                onSubmitEditing={handleCodeSend} />
                            <Text
                                style={styles.email_example}
                                onPress={handleTextClick}
                            >@mju.ac.kr</Text>
                        </View>
                    </View>

                    {isCodeSent ?
                        (<>
                            <View style={styles.code_container}>
                                <View style={isWrong ? styles.code_input_wrong : styles.code_input}>
                                <TextInput
                                    onChangeText={setCode}
                                    value={code}
                                    maxLength={4}
                                    keyboardType="numeric"
                                    placeholder={isWrong? "다시 입력해주세요." : "인증코드"}
                                    placeholderTextColor={isWrong ? 'red' : undefined}
                                    />
                                <Text style={{flex: 1, textAlign: 'right', fontSize:13, color:'gray'}}>
                                    { isExpire ? "시간만료" : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
                                </Text>
                                </View>
                                <TouchableOpacity style={styles.code_resend}
                                onPress={handleResendCode}
                                activeOpacity={0.7}><Text style={styles.resend_text}>재전송</Text></TouchableOpacity>
                            </View>
                            <View style={styles.code_confirm_container}>
                                <TouchableOpacity style={isCodeEmpty ? styles.code_not_confirm : styles.code_confirm}
                                disabled={isCodeEmpty}
                                onPress={handleVerifyCode}
                                activeOpacity={0.7}><Text style={styles.confirm_text}>확인</Text></TouchableOpacity>                                
                            </View>
                        </>) :
                        (<View style={styles.button_container}>
                            <TouchableOpacity
                                disabled={isPressed}
                                activeOpacity={0.7}
                                style={styles.email_send_button}
                                onPress={handleCodeSend}><Text style={styles.send_button_text}>인증번호 보내기</Text>
                            </TouchableOpacity>
                        </View>)}
                    <View style={styles.bottom_blank}></View>
                </View>
            </KeyboardLayout>
        </>
    )
}
export function Step2Screen({ route, navigation }) {
    const { email } = route.params;
    const [progress, setProgress] = useState(0.33);
    const [isPasswordWrong, setIsPasswordWrong] = useState(false);
    const [isPasswordCheckWrong, setIsPasswordCheckWrong] = useState(false);
    useEffect(()=>{
        setProgress(0.66);
    },[]);
    const passwordRegExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*&])(?=.*[0-9]).{8,20}$/; //안전 비밀번호 정규식
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const handlePasswordCheck = () => {
        if (password.length === 0) {
            setIsPasswordWrong(true);
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'경고', message: '비밀번호를 입력해주세요.'});
            // return Alert.alert('경고', '비밀번호를 입력해주세요.');
        } else if (!passwordRegExp.test(password)) {
            setIsPasswordWrong(true);
            setPasswordCheck('');
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'경고', message: '안전하지 않은 비밀번호입니다.\n\n영문, 숫자, 특수문자 포함 8글자 이상의 비밀번호를 설정해주세요.'});
            // return Alert.alert('경고', '안전하지 않은 비밀번호입니다.\n\n영문, 숫자, 특수문자 포함 8글자 이상의 비밀번호를 설정해주세요.')
        } else if (passwordCheck.length === 0) {
            setIsPasswordWrong(false);
            setIsPasswordCheckWrong(true);
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'경고', message: '비밀번호 재입력을 입력해주세요.'});
            // return Alert.alert('경고', '비밀번호 재입력을 입력해주세요.')
        } else if (password !== passwordCheck) {
            setIsPasswordWrong(false);
            setIsPasswordCheckWrong(true);
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'경고', message: '동일한 비밀번호를 입력해주세요.'});
            // return Alert.alert('경고', '동일한 비밀번호를 입력해주세요.')
        }
        // 모든 검증을 마쳤으면 비밀번호를 저장 (**백엔드**) 하고 다음단계로 이동.
        navigation.navigate('Step3', {
            email: email,
            password: password,
        });
        setIsPasswordWrong(false);
        setIsPasswordCheckWrong(false);
    }
    return (
        <KeyboardLayout>
            <>
            <Progress.Bar 
            style={styles.progress} 
            progress={progress} width={SCREEN_WIDTH} height={10} animated={true}
            color={'#002E66'}/>
            <View style={styles.container}>
                <StatusBar style="auto"/>
                <View style={styles.top_blank}></View>
                <View style={styles.icon_container}>
                    <Image
                        style={styles.myongji_icon}
                        source={require('../../../assets/myongjicamp-title.png')} />
                </View>
                <View style={styles.text_container}>
                    <Text style={styles.text}>안전한 비밀번호를 만들어주세요.</Text>
                </View>
                <View style={styles.password_container}>
                    <TextInput style={isPasswordWrong ? styles.password_input_wrong : styles.password_input}
                        placeholder={isPasswordWrong ? "영문,숫자,특수문자 포함 8글자 이상" : "비밀번호 입력"}
                        placeholderTextColor={isPasswordWrong ? 'red' : undefined}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry />
                    <TextInput style={isPasswordCheckWrong ? styles.password_check_input_wrong : styles.password_check_input}
                        placeholder={"비밀번호 재입력"}
                        placeholderTextColor={isPasswordCheckWrong ? 'red' : undefined}
                        value={passwordCheck}
                        onChangeText={setPasswordCheck}
                        secureTextEntry
                        onSubmitEditing={handlePasswordCheck} />
                </View>
                <View style={styles.password_button_container}>
                  <TouchableOpacity
                    style={styles.password_button}
                    onPress={handlePasswordCheck}
                    activeOpacity={0.7}><Text style={styles.password_button_text}>확인</Text>
                </TouchableOpacity>   
                </View>
                <View style={styles.bottom_blank}></View>
            </View>
            </>
        </KeyboardLayout>
    )
}
export function Step3Screen({route, navigation}) {
    const { email, password } = route.params;
    const nicknameRegex = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$/
   
    const [progress, setProgress] = useState(0.66);
    useEffect(()=>{
        setProgress(1);
    },[])   
    const [ nickname, setNickname ] = useState('');
    const [ nicknameWrong, setNicknameWrong ] = useState(false);
    const [ checked, setChecked ] = useState(false);

    useEffect(()=>{
        setChecked(false);
    }, [nickname])

    const profileIcons = [
        {id: 1, name: 'red', image: require('../../../assets/icon/profile-icon-1.png')},
        {id: 2, name: 'green', image: require('../../../assets/icon/profile-icon-2.png')},
        {id: 3, name: 'blue', image: require('../../../assets/icon/profile-icon-3.png')},
        {id: 4, name: 'purple', image: require('../../../assets/icon/profile-icon-4.png')},
        {id: 5, name: 'pink', image: require('../../../assets/icon/profile-icon-5.png')},
    ]
    const [ profileIcon, setProfileIcon ] = useState({id: 1, name: 'red', image: require('../../../assets/icon/profile-icon-1.png')});

    const handleNicknameCheck = () => {
        if (nickname === ''){
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'경고', message: '닉네임을 입력해주세요.'});
            // return Alert.alert('경고' , '닉네임을 입력해주세요.');
        } else if (!nicknameRegex.test(nickname)){
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'경고', message: '닉네임은 특수문자 제외 2자 이상 8자 이하 입력해주세요.'});
            // return Alert.alert('경고', '닉네임은 특수문자 제외 2자 이상 8자 이하 입력해주세요.')
        }
        // **백엔드** 닉네임 DB에 중복확인
        // 중복 안하면
        navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message: '사용 가능한 닉네임입니다.'});
        // Alert.alert('안내', '사용 가능한 닉네임입니다.');
        setNicknameWrong(false);
        setChecked(true);
        // 중복 시
        // return Alert.alert('경고', '이미 존재하는 닉네임입니다.');
    }
    const handleSignupComplete = () => {
        // 중복확인이 true가 되면 DB에 지금까지의 이메일, PW, 닉네임을 넘기고 회원가입 완료.. => 홈 화면으로 이동
        if (!checked) {
            setNicknameWrong(true);
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'경고', message: '닉네임 중복검사를 해주세요.'});
            // return Alert.alert('경고', '닉네임 중복검사를 해주세요.');
        }
        //지금까지의 이메일, 비번, 닉네임을 DB에 보냄
        const userData = {
            email: `${email}@mju.ac.kr`,
            password: password,
            nickname: nickname,
            profileIcon: profileIcon.id,
        }
        console.log(userData);
        axios.post(`${API_URL}/api/members`,
        userData,
        { headers: { 'Content-Type': 'application/json'}})
        .then(res => {
            const result = res.data;
            console.log('너 맞음', result);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            })
            //성공해도 Login창에서 authlayout 거치느라 modal이 바로 닫힘.
            // navigation.navigate('ModalLayout', {component:'MyAlert', title:'안내', message: '회원가입에 성공했습니다.'});
            Alert.alert('안내', '회원가입에 성공했습니다.');
        })
        .catch(error => {
            const result = error.response.data;
            // console.log('너 틀림', result);
            return navigation.navigate('ModalLayout', {component:'MyAlert', title:'경고', message: result.data});
            // return Alert.alert('경고', result.data);
        })
    }
    return (
        <KeyboardLayout>
            <>
            <Progress.Bar
            style={styles.progress}
            progress={progress} width={SCREEN_WIDTH} height={10} animated={true}
            color={'#002E66'} />
            <View style={[styles.container, {alignItems:'center'}]}>
                <StatusBar style="auto"/>
                <View style={styles.top_blank}></View>
                <View style={[styles.icon_container, { marginBottom:hp('5%'), width:hp('20%')}]}>
                    <Image source={profileIcon.image} style={{borderRadius:100, width:hp('20%'), height:hp('20%')}}/>
                    <Picker
                    style={{width:'100%', height:'90%', opacity:0, position:'absolute'}}
                    selectedValue={profileIcon.id}
                    onValueChange={(value) => {
                        const selectedIcon = profileIcons.find((icon) => icon.id === value);
                        setProfileIcon(selectedIcon);
                    }}>
                    {profileIcons.map((icon) => (
                        <Picker.Item key={icon.id} label={icon.name} value={icon.id} />
                    ))}
                    </Picker>
                </View>
                <View style={styles.nickname_container}>
                    <TextInput
                        style={nicknameWrong ? styles.nickname_input_wrong : styles.nickname_input}
                        placeholder="닉네임" 
                        placeholderTextColor={nicknameWrong? 'red' : undefined}
                        onChangeText={setNickname}
                        value={nickname}
                        onSubmitEditing={handleNicknameCheck} />
                    <TouchableOpacity
                        activeOpacity={0.7}
                        disabled={checked}
                        style={checked ? styles.nickname_check_done : styles.nickname_check}
                        onPress={handleNicknameCheck}>
                        <Text style={{color:'white'}}>중복확인</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.signup_button_container}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.signup_button}
                        onPress={handleSignupComplete}>
                        <Text style={styles.signup_button_text}>회원가입 완료</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottom_blank}></View>
            </View>
            </>
        </KeyboardLayout>
    )
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        marginHorizontal: 40,
    },
    progress:{
        alignSelf: 'stretch',
        borderWidth: 0,
        backgroundColor: '#E9ECEF',
    },
    icon_container:{flex: 8, justifyContent: "center", alignItems: "center"},
    text_container: {flex: 3, justifyContent: 'center', alignItems: 'center'},
    email_container: {flex:6, justifyContent: 'center', alignItems: 'center'},
    button_container: {flex: 3, justifyContent: 'center', alignItems: 'center'},
    top_blank:{flex: 5,},
    bottom_blank:{flex: 8,},
    myongji_icon: {objectFit:'scale-down', flex:1},
    text: {fontSize: 18},
    email_box: { 
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 20,
    },
    email_value: {flex: 1},
    email_example: {color: 'gray'},
    email_send_button: {
        width: 140,
        height: 50,
        borderRadius: 30,
        backgroundColor: "#002E66",
        justifyContent: "center",
        alignItems: 'center',
    },
    send_button_text:{
        color: 'white'
    },
    code_container:{
        flex: 3,
        flexDirection: 'row',
        alignItems: 'stretch',
        marginBottom: 35,
    },
    code_input:{
        flex:1,
        borderWidth: 1,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginRight: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    code_input_wrong:{
        flex:1,
        borderWidth: 1,
        borderColor: 'red',
        paddingHorizontal: 16,
        borderRadius: 10,
        marginRight: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    code_resend:{
        width: 70,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#008FD5',
    },
    resend_text:{
        color: 'white',
    },
    code_confirm_container:{
        flex: 2.6,
        alignItems: 'center',
    },
    code_not_confirm:{
        flex: 1,
        borderRadius: 20,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#999999"
    },
    code_confirm:{
        flex: 1,
        borderRadius: 20,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#002E66"
    },
    confirm_text: {
        color: 'white',
    },
    password_container: {
    },
    password_input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 16,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    password_input_wrong: {
        height: 50,
        borderWidth: 1,
        borderRadius: 16,
        marginBottom: 10,
        paddingHorizontal: 20,
        borderColor: 'red',
    },
    password_check_input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 16,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    password_check_input_wrong: {
        height: 50,
        borderWidth: 1,
        borderRadius: 16,
        marginBottom: 10,
        paddingHorizontal: 20,
        borderColor: 'red',
    },
    password_button_container:{
        flex: 1,
        alignItems: 'center'
    },
    password_button:{
        width: 140,
        height: 50,
        borderRadius: 30,
        backgroundColor: "#002E66",
        justifyContent: "center",
        alignItems: 'center',
    },
    password_button_text:{
        color: 'white',
    },
    nickname_container: {
        flex: 2,
        flexDirection: 'row',
        marginBottom: 35,
    },
    nickname_input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 16,
        marginRight: 16,
        paddingHorizontal: 20,
    },
    nickname_input_wrong: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 16,
        marginRight: 16,
        paddingHorizontal: 20,
        borderColor: 'red',
    },
    nickname_check: {
        width: 60,
        backgroundColor: "#008FD5",
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nickname_check_done:{
        width: 60,
        backgroundColor: "gray",
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signup_button_container: {
        flex: 1,
        alignItems: 'center'
    },
    signup_button: {
        width: 140,
        height: 50,
        borderRadius: 30,
        backgroundColor: "#002E66",
        justifyContent: "center",
        alignItems: 'center',
    },
    signup_button_text: {
        color: 'white',
    }

});