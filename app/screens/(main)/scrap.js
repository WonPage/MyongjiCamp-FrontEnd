import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import DefaultLayout from "../../layout/keyboardlayout";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Modal } from "react-native";
import AuthLayout from "../../layout/authlayout";

const images = [
    { uri: '../../../assets/myongji-icon.png' },
    { uri: '../../../assets/myongjicamp.png' },
    { uri: '../../../assets/splash.png' },
    { uri: '../../../assets/icon.png' },
    { uri: '../../../assets/favicon.png' },
  ];
export default function Scrap({navigation, route}) {
    const [selectedImage, setSelectedImage] = useState(images[0].uri);
    const [isModalVisible, setIsModalVisible] = useState(false);
  
    const handleSelectImage = (image) => {
      setSelectedImage(image.uri);
      setIsModalVisible(false);
    };
  
    return (
      <AuthLayout navigation={navigation} route={route}>
        <View style={styles.container}>
          <Pressable onPress={() => setIsModalVisible(true)}>
            <Image
              style={styles.image}
              source={{ uri: selectedImage }}
            />
          </Pressable>
          <Modal
            animationType="slide"
            //   transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <ScrollView>
                {images.map((image) => (
                  <Pressable
                    key={image.uri}
                    onPress={() => handleSelectImage(image)}
                  >
                    <Image
                      style={styles.modalImage}
                      source={{ uri: image.uri }}
                    />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Modal>
        </View>
      </AuthLayout>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 200,
      height: 200,
      objectFit:'contain',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'yellow',
    },
    modalImage: {
      width: 100,
      height: 100,
      margin: 10,
    },
  });