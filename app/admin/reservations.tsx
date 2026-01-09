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
    container: {
        flex: 1,
        backgroundColor: Colors.bgLight,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bgLight,
    },
    list: {
        padding: 20,
        gap: 16,
        paddingBottom: 40,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 60,
        color: Colors.textMuted,
        fontSize: Typography.fontSize.md,
        fontWeight: '600',
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 20,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.bgLight,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    customerName: {
        fontSize: Typography.fontSize.lg,
        fontWeight: '800',
        color: Colors.textMain,
    },
    phone: {
        fontSize: 14,
        color: Colors.textMuted,
        marginTop: 2,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    details: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.bgLight,
        paddingTop: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        color: Colors.textMain,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cancelButtonText: {
        color: Colors.error,
        fontWeight: '800',
        fontSize: 14,
    },
    confirmButton: {
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    confirmButtonText: {
        color: Colors.white,
        fontWeight: '800',
        fontSize: 14,
    },
});
