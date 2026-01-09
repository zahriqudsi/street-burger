import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { Colors } from '../../src/constants/colors';
import { ActivityIndicator, View } from 'react-native';
import React, { useEffect } from 'react';

export default function AdminLayout() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            console.log('AdminLayout Auth Check:', { isAuthenticated, role: user?.role });
            if (!isAuthenticated || user?.role !== 'ADMIN') {
                router.replace('/');
            }
        }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.light.tint} />
            </View>
        );
    }

    // Don't render content if not authorized
    if (!isAuthenticated || user?.role !== 'ADMIN') {
        return null;
    }

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.white,
                },
                headerTintColor: Colors.secondary,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Admin Dashboard',
                }}
            />
            <Stack.Screen
                name="menu"
                options={{
                    title: 'Manage Menu',
                }}
            />
            <Stack.Screen
                name="reservations"
                options={{
                    title: 'Manage Reservations',
                }}
            />
            <Stack.Screen
                name="orders"
                options={{
                    title: 'Manage Orders',
                }}
            />
            <Stack.Screen
                name="notifications"
                options={{
                    title: 'Manage Notifications',
                }}
            />
            <Stack.Screen
                name="rewards"
                options={{
                    title: 'Manage Rewards',
                }}
            />
        </Stack>
    );
}
