import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Text, ToastAndroid, View } from "react-native";
import OnGoing, { Complete, Finish } from "../screens/(main)/hometab";
import AuthLayout from "../layout/authlayout";
import KeyboardLayout from "../layout/keyboardlayout";
import HomeSearch from "../screens/(main)/homesearch";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useFocusEffect } from "expo-router";
const TopTab = createMaterialTopTabNavigator();
export function HomeNavigation({ navigation, route }) {
    return (
        <AuthLayout navigation={navigation} route={route}>
            <View style={{marginHorizontal: '5%', flex: 1}}>
            <HomeSearch navigation={navigation} route={route}/>
            <TopTab.Navigator initialRouteName="OnGoing" pagerStyle={{marginTop:hp('1.5%')}}
                screenOptions={{ tabBarIndicatorStyle:{backgroundColor:'black', height:2, width:'0.2%'},
                tabBarStyle:{elevation:0, shadowOpacity:0, backgroundColor:'transparent'},
                swipeEnabled: false, tabBarLabelStyle: { fontSize: 26}, tabBarItemStyle:{width:'auto', marginHorizontal:hp('0.6%'), padding:0, justifyContent:'flex-end', alignItems:'center'}}}
                backBehavior="none">
                <TopTab.Screen name="OnGoing" component={OnGoing} options={{
                    title: '모집 중'
                }} />
                <TopTab.Screen name="Complete" component={Complete} options={{
                    title: '모집 완료'
                }} />
                <TopTab.Screen name="Finish" component={Finish} options={{
                    title: '개발 완료'
                }} />
            </TopTab.Navigator>
            </View>
        </AuthLayout>
    )
}