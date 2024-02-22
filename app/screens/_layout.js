import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
        <Stack.Screen name='signup' options={{
            title: '회원가입1'
        }} />
        <Stack.Screen name='login' options={{
            headerShown: false,
        }} />
    </Stack>
  );
}