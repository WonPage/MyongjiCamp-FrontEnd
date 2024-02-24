import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Step1Screen, Step2Screen, Step3Screen } from "../screens/(auth)/signup.js"
import Login from "../screens/(auth)/login";
import { useState } from "react";

const Stack = createNativeStackNavigator();
export default function Navigation(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return(
        <Stack.Navigator>
            {isLoggedIn ? (
                //로그인 된 유저의 화면
                <Stack.Group>

                </Stack.Group>
            ) : (
                //로그인 되지 않은 유저의 화면
                <Stack.Group screenOptions={{contentStyle: { backgroundColor: 'white' }}}>
                    <Stack.Screen name="Login" component={Login}
                        options={{
                            headerShown: false,
                        }} />
                    <Stack.Screen name="Step1" component={Step1Screen}
                        options={{
                            title: '회원가입',
                            headerTitleAlign: 'center',
                            headerShadowVisible: false,
                        }} />
                    <Stack.Screen name="Step2" component={Step2Screen}
                        options={signupOption} />
                    <Stack.Screen name="Step3" component={Step3Screen}
                        options={signupOption} />
                </Stack.Group>
            )}
            {/* 공통 Modal 창 (팝업창) */}
            <Stack.Group></Stack.Group>
        </Stack.Navigator>
    )
}

const signupOption = {
    title: '회원가입',
    headerTitleAlign: 'center',
    headerShadowVisible: false,
    animation: 'none'
}

const animation = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
}