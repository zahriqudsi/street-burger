import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, ActivityIndicator, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { userService } from '../../src/services';
import { User } from '../../src/types';
import { Colors } from '../../src/constants/colors';
import { Stack } from 'expo-router';
import { BackButton } from '@/components/BackButton';

export default function ManageUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (search) {
            setFilteredUsers(
                users.filter(u =>
                    u.name.toLowerCase().includes(search.toLowerCase()) ||
                    u.phoneNumber.includes(search) ||
                    u.id.toString().includes(search)
                )
            );
        } else {
            setFilteredUsers(users);
        }
    }, [search, users]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAll();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            Alert.alert('Error', 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    if (loading && users.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.light.tint} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                title: 'User Management',
                headerLeft: () => <BackButton />
            }} />
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by ID, Name or Phone..."
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <ScrollView style={styles.userList} contentContainerStyle={styles.listContent}>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <View key={user.id} style={styles.userCard}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{user.name[0]}</Text>
                            </View>
                            <View style={styles.userInfo}>
                                <View style={styles.userHeader}>
                                    <Text style={styles.userName}>{user.name}</Text>
                                    <View style={[styles.badge, user.role === 'ADMIN' ? styles.adminBadge : styles.userBadge]}>
                                        <Text style={styles.badgeText}>{user.role}</Text>
                                    </View>
                                </View>
                                <Text style={styles.userDetail}>ID: {user.id}</Text>
                                <Text style={styles.userDetail}>📞 {user.phoneNumber}</Text>
                                {user.email && <Text style={styles.userDetail}>✉️ {user.email}</Text>}
                            </View>
                            <TouchableOpacity
                                onPress={() => Alert.alert('Copy ID', `User ID: ${user.id} copied to clipboard (Simulated)`)}
                                style={styles.copyButton}
                            >
                                <Ionicons name="copy-outline" size={20} color={Colors.light.tint} />
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No users found</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        margin: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEE'
    },
    searchInput: { flex: 1, padding: 12, fontSize: 16 },
    userList: { flex: 1 },
    listContent: { padding: 16, paddingBottom: 40 },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    avatarText: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
    userInfo: { flex: 1 },
    userHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    userName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    adminBadge: { backgroundColor: '#e74c3c20' },
    userBadge: { backgroundColor: '#2ecc7120' },
    badgeText: { fontSize: 10, fontWeight: 'bold', color: '#333' },
    userDetail: { fontSize: 14, color: '#666', marginBottom: 2 },
    copyButton: { padding: 8 },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: '#999', fontSize: 16 }
});
