import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
import { reservationService } from '../../src/services/reservations';
import { Reservation } from '../../src/types';

export default function ManageReservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        try {
            setLoading(true);
            const data = await reservationService.getAll();
            // Sort by date descending
            setReservations(data.sort((a, b) => new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime()));
        } catch (error) {
            Alert.alert('Error', 'Failed to load reservations');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadReservations();
        setRefreshing(false);
    };

    const handleConfirm = async (id: number) => {
        try {
            await reservationService.confirm(id);
            Alert.alert('Success', 'Reservation confirmed');
            loadReservations();
        } catch (error) {
            Alert.alert('Error', 'Failed to confirm reservation');
        }
    };

    const handleCancel = async (id: number) => {
        Alert.alert(
            'Cancel Reservation',
            'Are you sure you want to cancel this reservation?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await reservationService.cancel(id);
                            loadReservations();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to cancel');
                        }
                    }
                },
            ]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return '#4CAF50';
            case 'PENDING': return '#FFC107';
            case 'CANCELLED': return '#F44336';
            default: return '#9E9E9E';
        }
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.light.tint} />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.list}>
                {reservations.length === 0 ? (
                    <Text style={styles.emptyText}>No reservations found</Text>
                ) : (
                    reservations.map(res => (
                        <View key={res.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.customerName}>{res.guestName || 'Guest'}</Text>
                                    <Text style={styles.phone}>{res.phoneNumber}</Text>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(res.status) + '20' }]}>
                                    <Text style={[styles.statusText, { color: getStatusColor(res.status) }]}>{res.status}</Text>
                                </View>
                            </View>

                            <View style={styles.details}>
                                <View style={styles.detailItem}>
                                    <Ionicons name="calendar-outline" size={16} color="#666" />
                                    <Text style={styles.detailText}>{res.reservationDate}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Ionicons name="time-outline" size={16} color="#666" />
                                    <Text style={styles.detailText}>{res.reservationTime}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Ionicons name="people-outline" size={16} color="#666" />
                                    <Text style={styles.detailText}>{res.guestCount} People</Text>
                                </View>
                            </View>

                            {res.status === 'PENDING' && (
                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.cancelButton]}
                                        onPress={() => handleCancel(res.id)}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.confirmButton]}
                                        onPress={() => handleConfirm(res.id)}
                                    >
                                        <Text style={styles.confirmButtonText}>Confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: 16, gap: 16 },
    emptyText: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 16 },
    card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    customerName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    phone: { fontSize: 14, color: '#666', marginTop: 2 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    details: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12 },
    detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    detailText: { fontSize: 14, color: '#444' },
    actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
    actionButton: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
    cancelButton: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F44336' },
    cancelButtonText: { color: '#F44336', fontWeight: 'bold' },
    confirmButton: { backgroundColor: Colors.light.tint },
    confirmButtonText: { color: '#FFF', fontWeight: 'bold' },
});
