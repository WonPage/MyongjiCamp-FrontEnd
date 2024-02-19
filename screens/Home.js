import { StyleSheet, Text, View } from 'react-native';
const Home = () => {
    return(
            <Text style={styles.container}>안녕하세요</Text>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff000',
      alignItems: 'center',
      justifyContent: 'center',
    }
});  

export default Home;