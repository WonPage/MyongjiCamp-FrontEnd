import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useState} from 'react';

export default function Login({navigation}) {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  return(
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={'이메일을 입력하세요.'}
        onChangeText={onChangeEmail}
        value={email}/>
      <TextInput
        style={styles.input}
        placeholder={'비밀번호를 입력하세요.'}
        onChangeText={onChangePassword}
        value={password}/>
      <Button title='로그인' onPress={()=> navigation.navigate('Home')}/>
      <Text style={styles.text}>로그인!!!!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff000',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 28,
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
}); 