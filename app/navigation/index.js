import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator, CardStyleInterpolators, CardAnimationContext } from "@react-navigation/stack";
import { Step1Screen, Step2Screen, Step3Screen } from "../screens/(auth)/signup.js"
import Login from "../screens/(auth)/login";
import React, { useEffect, useRef, useState } from "react";
import Scrap from "../screens/(main)/scrap.js";
import Post, { PostButton, PostSend } from "../screens/(main)/post.js";
import Apply from "../screens/(main)/apply.js";
import MyPage from "../screens/(main)/mypage.js";
import Notification, {NotificationIcon} from "../screens/(main)/notification.js";
import { BackHandler, Platform, Text, TouchableOpacity } from "react-native";
import { AntDesign, Feather, FontAwesome5, Octicons } from "@expo/vector-icons";
import Notice from "../screens/(other)/notice.js";
import FAQ from "../screens/(other)/faq.js";
import Event from "../screens/(other)/event.js";
import Account from "../screens/(other)/pwchange.js";
import Information from "../screens/(other)/information.js";
import NotifySetting from "../screens/(other)/notifysetting.js";
import Resume from "../screens/(sub)/resume.js";
import { HomeNavigation } from "./homenavigation.js";
import Search from "../screens/(main)/search.js";
import SearchResult from "../screens/(main)/searchresult.js";
import MyAlert from "../modal/modallayout.js";
import ModalLayout from "../modal/modallayout.js";
import PostDetail from "../screens/(main)/postdetail.js";
import PwFind from "../screens/(auth)/pwfind.js";
import PwChange from "../screens/(other)/pwchange.js";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function RootNavigation({navigation, route}){
    const [ unread, setUnread ] = useState(1);
    return(
        <Tab.Navigator initialRouteName="Home" sceneContainerStyle={{backgroundColor:'#f4f7f9'}} screenOptions={{ headerTitleStyle:{fontSize: 28}, 
            headerStatusBarHeight:7, tabBarActiveTintColor: '#003366', tabBarInactiveTintColor: '#a7a9ac',
            tabBarStyle:{ height: 70, paddingTop: 5, paddingBottom:3 }, tabBarLabelStyle: { marginBottom : 10 },
            headerRight : (props) => <NotificationIcon {...props} navigation={navigation}/>}}>
            <Tab.Screen name="Home" component={HomeNavigation}
            options={{ title: '홈', headerTitle: '명지캠프', unmountOnBlur:true, headerStyle:{backgroundColor:'#ffffff'},
                tabBarIcon: ({color, size}) => <Octicons name="home" size={24} color={color} />}}/>
            <Tab.Screen name="Scrap" component={Scrap}
            options={{ title: '스크랩', unmountOnBlur:true,
            tabBarIcon: ({color, size}) => <Feather name="bookmark" size={24} color={color} />}}/>
            <Tab.Screen name="PostButton" component={PostButton}
            options={{ title: '글쓰기', unmountOnBlur:true,
            tabBarIcon: ({color, size}) => <AntDesign name="pluscircle" size={34} color={'#003366'} />,
            tabBarButton: (props) => (<TouchableOpacity
                activeOpacity={0.7} {...props} onPress={()=>{navigation.push('Post');}}/>),
            tabBarLabelStyle: {display: 'none'}}}/>
            <Tab.Screen name="Apply" component={Apply}
            options={{ title: '지원현황', unmountOnBlur:true,
            tabBarBadge: ( unread >=1 ? unread : undefined ), tabBarBadgeStyle: {fontSize: 11},
            tabBarIcon: ({color, size}) => <FontAwesome5 name="folder-open" size={24} color={color} />}}/>
            <Tab.Screen name="MyPage" component={MyPage}
            options={{ title: '마이페이지',
                tabBarIcon: ({color, size}) => <Octicons name="person" size={24} color={color} />}}/>
        </Tab.Navigator>
    )
}

export default function Navigation(){
    return(
        <Stack.Navigator screenOptions={{headerStatusBarHeight: 7}} initialRouteName="Login">
            {/* Auth Group */}
            <Stack.Group>
                <Stack.Screen name="Login" component={Login}
                options={{headerShown: false, cardStyle:{backgroundColor:'white'}}} />    
                <Stack.Screen name="Step1" component={Step1Screen} 
                options={{cardStyle:{backgroundColor:'white'}, title: '회원가입', headerTitleAlign: 'center', headerShadowVisible: false}} />
                <Stack.Screen name="Step2" component={Step2Screen}
                options={signupOption} />
                <Stack.Screen name="Step3" component={Step3Screen}
                options={signupOption} />
                <Stack.Screen name="PwFind" component={PwFind} options={{
                    title:'비밀번호 찾기', headerTitleAlign:'center', cardStyle:{backgroundColor:'white'}
                }}/>
            </Stack.Group>

            {/* Main Group */}
            <Stack.Group>
                <Stack.Screen name="Root" component={RootNavigation} options={{
                headerShown: false, headerMode:'screen',
                cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid}}/>
                <Stack.Screen name="Post" component={Post} options={{ unmountOnBlur:true,
                    cardStyleInterpolator: (Platform.OS==='ios' ? CardStyleInterpolators.forVerticalIOS : CardStyleInterpolators.forBottomSheetAndroid),
                    headerTitleAlign: 'center', headerTitle: '글 작성',
                }}/>
                <Stack.Screen name="PostDetail" component={PostDetail} options={(option)=>({
                    title: option.route.params.title, headerTitleAlign: 'center',
                })}/>
                <Stack.Screen name="Notification" component={Notification} options={{ unmountOnBlur: true,
                    cardStyleInterpolator: (Platform.OS==='ios' ? CardStyleInterpolators.forVerticalIOS : CardStyleInterpolators.forFadeFromBottomAndroid),
                    headerTitleAlign: 'center', headerTitle: '알림',
                }}/>
                <Stack.Screen name="Resume" component={Resume} options={{unmountOnBlur: true, title: '이력서', headerTitleAlign: 'center',
                headerTitleStyle:{fontSize: 28}}}  />
                <Stack.Screen name="Search" component={Search} options={{unmountOnBlur: true, title: '검색', headerTitleAlign: 'center'}} />
                <Stack.Screen name="SearchResult" component={SearchResult} options={{unmountOnBlur: true, title: '검색 결과', headerTitleAlign: 'center'}}/>
            </Stack.Group>

            {/* Sub Group */}
            <Stack.Group>
                <Stack.Screen name="Notice" component={Notice} options={{title:'공지사항'}}/>
                <Stack.Screen name="FAQ" component={FAQ}/>
                <Stack.Screen name="Event" component={Event} options={{title:'이벤트'}}/>
                <Stack.Screen name="PwChange" component={PwChange} options={{title:'비밀번호 변경'}}/>
                <Stack.Screen name="Information" component={Information} options={{title:'이용안내'}}/>
                <Stack.Screen name="NotifySetting" component={NotifySetting} options={{title:'알림설정'}}/>
            </Stack.Group>

            {/* 공통 Modal 창 (팝업창) */}
            <Stack.Group screenOptions={{presentation: 'transparentModal', headerShown:false}}>
                <Stack.Screen name="ModalLayout" component={ModalLayout}/>
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