import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
import { rewardService } from '../../src/services/rewards';

export default function ManageRewards() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [points, setPoints] = useState('');
    const [description, setDescription] = useState('Manual admin adjustment');
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [userDetails, setUserDetails] = useState<any>(null);

    const handleSearch = async () => {
        if (!phoneNumber) return;
        try {
            setSearching(true);
            const data = await rewardService.getByPhone(phoneNumber);
            setUserDetails(data);
        } catch (error) {
            Alert.alert('Not Found', 'No rewards account found for this phone number');
            setUserDetails(null);
        } finally {
            setSearching(false);
        }
    };

    const handleAddPoints = async () => {
        if (!phoneNumber || !points) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {
            setLoading(true);
            await rewardService.addPoints({
                phoneNumber,
                points: parseInt(points),
                description,
                transactionType: 'ADMIN_ADD'
            });

            Alert.alert('Success', `Added ${points} points to ${phoneNumber}`);
            setPoints('');
            handleSearch(); // Refresh user details
        } catch (error) {
            Alert.alert('Error', 'Failed to add points. Make sure the phone number is registered.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Manage User Points</Text>

                <View style={styles.searchSection}>
                    <TextInput
                        style={[styles.input, { flex: 1, marginBottom: 0 }]}
                        placeholder="User Phone Number"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={handleSearch}
                        disabled={searching}
                    >
                        {searching ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Ionicons name="search" size={24} color="#FFF" />
                        )}
                    </TouchableOpacity>
                </View>

                {userDetails && (
                    <View style={styles.userCard}>
                        <View style={[styles.pointsBadge, { backgroundColor: Colors.light.tint + '20' }]}>
                            <Text style={styles.pointsLabel}>Current Balance</Text>
                            <Text style={styles.pointsValue}>{userDetails.totalPoints} pts</Text>
                        </View>
                    </View>
                )}

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Points to Add/Deduct</Text>
                        <Text style={styles.hint}>Use negative numbers for deductions</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 100 or -50"
                            keyboardType="numeric"
                            value={points}
                            onChangeText={setPoints}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Reason for adjustment"
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.addButton, loading && styles.disabledButton]}
                        onPress={handleAddPoints}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Ionicons name="add-circle" size={24} color="#FFF" />
                                <Text style={styles.addButtonText}>Update Points</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgLight,
    },
    content: {
        padding: 20,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.bgLight,
    },
    cardTitle: {
        fontSize: Typography.fontSize.xl,
        fontWeight: '800',
        marginBottom: 24,
        color: Colors.textMain,
    },
    searchSection: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    searchButton: {
        backgroundColor: Colors.textMain,
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    userCard: {
        backgroundColor: Colors.primary + '10',
        borderRadius: 20,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: Colors.primary + '20',
        alignItems: 'center',
    },
    pointsBadge: {
        alignItems: 'center',
    },
    pointsLabel: {
        fontSize: 14,
        color: Colors.textMuted,
        marginBottom: 4,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    pointsValue: {
        fontSize: 42,
        fontWeight: '900',
        color: Colors.primary,
    },
    form: {
        borderTopWidth: 1,
        borderTopColor: Colors.bgLight,
        paddingTop: 32,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '700',
        color: Colors.textMain,
        marginBottom: 10,
        marginLeft: 4,
    },
    hint: {
        fontSize: 12,
        color: Colors.textMuted,
        marginBottom: 10,
        marginLeft: 4,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 16,
        padding: 16,
        fontSize: Typography.fontSize.base,
        backgroundColor: Colors.bgLight,
        color: Colors.textMain,
    },
    addButton: {
        backgroundColor: Colors.primary,
        padding: 18,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginTop: 12,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    disabledButton: {
        opacity: 0.6,
    },
    addButtonText: {
        color: Colors.white,
        fontSize: Typography.fontSize.lg,
        fontWeight: '800',
    },
});
