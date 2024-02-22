import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Step1Screen, Step2Screen, Step3Screen } from "./signup";
import Login from "./login";

const Stack = createNativeStackNavigator();
export default function Layout(){
    return(
        <Stack.Navigator initialRouteName="Step1">
            <Stack.Screen name="Login" component={Login}
            options={{
                headerShown: false,
            }} />
            <Stack.Screen name="Step1" component={Step1Screen} />
            <Stack.Screen name="Step2" component={Step2Screen} />
            <Stack.Screen name="Step3" component={Step3Screen} />
        </Stack.Navigator>
    )
}