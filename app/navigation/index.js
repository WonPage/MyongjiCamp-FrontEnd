import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator, CardStyleInterpolators, CardAnimationContext } from "@react-navigation/stack";
import { Step1Screen, Step2Screen, Step3Screen } from "../screens/(auth)/signup.js"
import Login from "../screens/(auth)/login";
import React, { useState } from "react";
import Home from "../screens/(main)/home.js";
import Scrap from "../screens/(main)/scrap.js";
import Post, { PostButton } from "../screens/(main)/post.js";
import Apply from "../screens/(main)/apply.js";
import MyPage from "../screens/(main)/mypage.js";
import Notification, {NotificationIcon} from "../screens/(main)/notification.js";
import { Platform, Text, TouchableOpacity } from "react-native";
import { AntDesign, Feather, FontAwesome5, Octicons } from "@expo/vector-icons";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Root({navigation}){
    const [ unread, setUnread ] = useState(1);
    return(
        <Tab.Navigator screenOptions={{ headerTitleStyle:{fontSize: 28}, headerStatusBarHeight:7, tabBarActiveTintColor: 'black', tabBarInactiveTintColor: '#999999',
            tabBarStyle:{ height: 70, paddingTop: 5, paddingBottom:3, }, tabBarLabelStyle: { marginBottom : 10 },
            headerRight : (props) => <NotificationIcon {...props} navigation={navigation}/>, unmountOnBlur: true}}>
            <Tab.Screen name="Home" component={Home}
            options={{ title: '홈', headerTitle: '명지캠프',
                tabBarIcon: ({color, size}) => <Octicons name="home" size={24} color={color} />}}/>
            <Tab.Screen name="스크랩" component={Scrap}
            options={{tabBarIcon: ({color, size}) => <Feather name="bookmark" size={24} color={color} />}}/>
            <Tab.Screen name="글쓰기" component={PostButton}
            options={{tabBarIcon: ({color, size}) => <AntDesign name="pluscircle" size={34} color={'black'} />,
            tabBarButton: (props) => (<TouchableOpacity
                activeOpacity={0.7} {...props} onPress={()=>{navigation.navigate('Post');}}/>),
            tabBarLabelStyle: {display: 'none'}}}/>
            <Tab.Screen name="지원현황" component={Apply}
            options={{
            tabBarBadge: ( unread >=1 ? unread : undefined ), tabBarBadgeStyle: {fontSize: 11},
            tabBarIcon: ({color, size}) => <FontAwesome5 name="folder-open" size={24} color={color} />}}/>
            <Tab.Screen name="마이페이지" component={MyPage}
            options={{tabBarIcon: ({color, size}) => <Octicons name="person" size={24} color={color} />}}/>
        </Tab.Navigator>
    )
}

export default function Navigation(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    return(
        <Stack.Navigator>

            {/* 로그인 된 유저 / 안 된 유저 화면 구분해야함 (수정해야함) */}
            <Stack.Group screenOptions={{headerStatusBarHeight: 7}}>
                <Stack.Screen name="Login" component={Login}
                options={{headerShown: false, cardStyle:{backgroundColor:'white'}}} />
                <Stack.Screen name="Step1" component={Step1Screen} 
                options={{cardStyle:{backgroundColor:'white'}, title: '회원가입', headerTitleAlign: 'center', headerShadowVisible: false}} />
                <Stack.Screen name="Step2" component={Step2Screen}
                options={signupOption} />
                <Stack.Screen name="Step3" component={Step3Screen}
                options={signupOption} />
                
                <Stack.Screen name="Root" component={Root} options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid}}/>
                <Stack.Screen name="Post" component={Post}
                options={{
                    cardStyleInterpolator: (Platform.OS==='ios' ? CardStyleInterpolators.forVerticalIOS : CardStyleInterpolators.forBottomSheetAndroid),
                    // headerStatusBarHeight: 7,
                    headerTitleAlign: 'center', headerTitle: '글 작성',
                }}/>
                <Stack.Screen name="Notification" component={Notification}
                options={{
                    cardStyleInterpolator: (Platform.OS==='ios' ? CardStyleInterpolators.forVerticalIOS : CardStyleInterpolators.forFadeFromBottomAndroid),
                    // headerStatusBarHeight: 7,
                    headerTitleAlign: 'center', headerTitle: '알림',
                }}/>

            </Stack.Group>

            {/* 공통 Modal 창 (팝업창) */}
            <Stack.Group screenOptions={{presentation: 'modal'}}>
            </Stack.Group>

        </Stack.Navigator>
    )
}

const signupOption = {
    cardStyle:{backgroundColor:'white'},
    title: '회원가입',
    headerTitleAlign: 'center',
    headerShadowVisible: false,
    cardStyleInterpolator: (CardStyleInterpolators.forNoAnimation),
}