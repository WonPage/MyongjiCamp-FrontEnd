import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import OnGoing, { Complete, Finish } from "../screens/(main)/hometab";
import AuthLayout from "../layout/authlayout";
import KeyboardLayout from "../layout/keyboardlayout";
import HomeSearch from "../screens/(main)/homesearch";

const TopTab = createMaterialTopTabNavigator();

export function HomeNavigation({ navigation, route }) {
    return (
        <AuthLayout navigation={navigation} route={route}>
            <View style={{marginHorizontal: '5%', flex: 1,}}>
            <HomeSearch navigation={navigation} route={route}/>
            <TopTab.Navigator initialRouteName="OnGoing"
                screenOptions={{ swipeEnabled: false, tabBarLabelStyle: { fontSize: 20 } }}
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