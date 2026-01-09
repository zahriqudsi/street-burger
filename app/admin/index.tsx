import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Stack } from 'expo-router';
import { BackButton } from '@/components/BackButton';

import { Typography } from '../../src/constants/typography';

const ADMIN_MODULES = [
    { id: 'menu', title: 'Menu & Categories', icon: 'fast-food' as const, color: '#FF6B35' },
    { id: 'orders', title: 'Orders', icon: 'cart' as const, color: '#3182CE' },
    { id: 'reservations', title: 'Reservations', icon: 'calendar' as const, color: '#38A169' },
    { id: 'notifications', title: 'Notifications', icon: 'notifications' as const, color: '#805AD5' },
    { id: 'rewards', title: 'Reward Points', icon: 'gift' as const, color: '#D69E2E' },
    { id: 'users', title: 'Users', icon: 'people' as const, color: '#319795' },
    { id: 'moderate_reviews', title: 'Reviews', icon: 'star' as const, color: '#ECC94B' },
    { id: 'restaurant_settings', title: 'Settings', icon: 'settings' as const, color: '#718096' },
];

export default function AdminDashboard() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title: 'Admin Dashboard',
                headerLeft: () => <BackButton />
            }} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>Welcome, Admin 👋</Text>
                    <Text style={styles.subText}>Manage your restaurant's digital presence</Text>
                </View>

                <View style={styles.grid}>
                    {ADMIN_MODULES.map((module) => (
                        <TouchableOpacity
                            key={module.id}
                            style={styles.card}
                            onPress={() => router.push(`/admin/${module.id}` as any)}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: module.color + '15' }]}>
                                <Ionicons name={module.icon} size={28} color={module.color} />
                            </View>
                            <Text style={styles.moduleTitle}>{module.title}</Text>
                            <View style={styles.cardFooter}>
                                <Text style={styles.manageText}>Manage</Text>
                                <Ionicons name="arrow-forward" size={16} color={Colors.textMuted} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgLight,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        padding: 24,
        paddingTop: 16,
        backgroundColor: Colors.white,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 5,
        marginBottom: 24,
    },
    welcomeText: {
        fontSize: Typography.fontSize['3xl'],
        fontWeight: '800',
        color: Colors.textMain,
    },
    subText: {
        fontSize: Typography.fontSize.md,
        color: Colors.textMuted,
        marginTop: 6,
        fontWeight: '500',
    },
    grid: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    card: {
        width: '47%',
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 24,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.bgLight,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    moduleTitle: {
        fontSize: Typography.fontSize.base,
        fontWeight: '700',
        color: Colors.textMain,
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.bgLight,
    },
    manageText: {
        fontSize: Typography.fontSize.xs,
        fontWeight: '700',
        color: Colors.textMuted,
        textTransform: 'uppercase',
    },
});
