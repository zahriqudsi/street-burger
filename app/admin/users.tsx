import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, ActivityIndicator, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { userService } from '../../src/services';
import { User } from '../../src/types';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
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
    container: {
        flex: 1,
        backgroundColor: Colors.bgLight,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bgLight,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        margin: 20,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        padding: 14,
        fontSize: Typography.fontSize.base,
        color: Colors.textMain,
    },
    userList: {
        flex: 1,
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 24,
        marginBottom: 12,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.bgLight,
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 18,
        backgroundColor: Colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.primary,
    },
    userInfo: {
        flex: 1,
    },
    userHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    userName: {
        fontSize: Typography.fontSize.md,
        fontWeight: '800',
        color: Colors.textMain,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    adminBadge: {
        backgroundColor: Colors.error + '15',
    },
    userBadge: {
        backgroundColor: Colors.primary + '15',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: Colors.textMain,
        textTransform: 'uppercase',
    },
    userDetail: {
        fontSize: 13,
        color: Colors.textMuted,
        marginBottom: 2,
        fontWeight: '600',
    },
    copyButton: {
        padding: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: Colors.textMuted,
        fontSize: Typography.fontSize.md,
        fontWeight: '600',
    },
});
