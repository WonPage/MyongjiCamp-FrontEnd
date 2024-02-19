import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function Home({navigation}) {
    return(
      <View style={styles.container}>
        <Text style={styles.text}>안녕하s세요!!!</Text>
        <Button title='로그인창으로' onPress={() => navigation.navigate('Login')}/>
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
}); 