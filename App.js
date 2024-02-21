import {View,Text,StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
    <Text style={styles.text}>하이안녕하세요</Text>
  </View>
  );
}
const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
  },
})
