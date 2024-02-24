import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Step1Screen, Step2Screen, Step3Screen } from "./signup";
import Login from "./login";

const Stack = createNativeStackNavigator();
export default function Layout(){
    return(
        <Stack.Navigator initialRouteName="Step1"
            screenOptions={{
                contentStyle: { backgroundColor: 'white' },
            }}>
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
                options={signupOption}/>
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