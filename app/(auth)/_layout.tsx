/**
 * Street Burger - Auth Layout
 */

import { Colors } from '@/src/constants/colors';
import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.light.background },
            }}
        >
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
        </Stack>
    );
}
