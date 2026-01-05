import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
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
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    content: { padding: 16 },
    card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    searchSection: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    searchButton: { backgroundColor: '#333', width: 56, height: 56, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    userCard: { backgroundColor: '#F0F9FF', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#BAE6FD' },
    pointsBadge: { alignItems: 'center' },
    pointsLabel: { fontSize: 14, color: '#0369A1', marginBottom: 4 },
    pointsValue: { fontSize: 32, fontWeight: 'bold', color: '#0369A1' },
    form: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 24 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', color: '#444', marginBottom: 4 },
    hint: { fontSize: 12, color: '#999', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 14, fontSize: 16, backgroundColor: '#FAFAFA' },
    addButton: { backgroundColor: Colors.light.tint, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 },
    disabledButton: { opacity: 0.6 },
    addButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
