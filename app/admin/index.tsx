import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';

const ADMIN_MODULES = [
    { id: 'menu', title: 'Menu & Categories', icon: 'fast-food' as const, color: '#FF5722' },
    { id: 'reservations', title: 'Reservations', icon: 'calendar' as const, color: '#4CAF50' },
    { id: 'orders', title: 'Orders', icon: 'cart' as const, color: '#2196F3' },
    { id: 'notifications', title: 'Notifications', icon: 'notifications' as const, color: '#9C27B0' },
    { id: 'rewards', title: 'Reward Points', icon: 'gift' as const, color: '#FFC107' },
];

export default function AdminDashboard() {
    const router = useRouter();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome, Admin</Text>
                <Text style={styles.subText}>Manage your restaurant from here</Text>
            </View>

            <View style={styles.grid}>
                {ADMIN_MODULES.map((module) => (
                    <TouchableOpacity
                        key={module.id}
                        style={[styles.card, { borderLeftColor: module.color }]}
                        onPress={() => router.push(`/admin/${module.id}` as any)}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: module.color + '20' }]}>
                            <Ionicons name={module.icon} size={32} color={module.color} />
                        </View>
                        <Text style={styles.moduleTitle}>{module.title}</Text>
                        <Ionicons name="chevron-forward" size={24} color="#CCC" />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        padding: 24,
        backgroundColor: '#FFF',
        marginBottom: 16,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: '800',
        color: '#333',
    },
    subText: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    grid: {
        padding: 16,
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        borderLeftWidth: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    moduleTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
});
