import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
import { orderService, Order } from '../../src/services/orders';

export default function ManageOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const STATUS_FLOW = ['PENDING', 'PREPARING', 'READY', 'COMPLETED'];

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getAllOrders();
            setOrders(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadOrders();
        setRefreshing(false);
    };

    const handleUpdateStatus = async (id: number, currentStatus: string) => {
        const currentIndex = STATUS_FLOW.indexOf(currentStatus);
        if (currentIndex === -1 || currentIndex === STATUS_FLOW.length - 1) return;

        const nextStatus = STATUS_FLOW[currentIndex + 1];

        try {
            await orderService.updateStatus(id, nextStatus);
            loadOrders();
        } catch (error) {
            Alert.alert('Error', 'Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return '#4CAF50';
            case 'READY': return '#2196F3';
            case 'PREPARING': return '#FF9800';
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
                {orders.length === 0 ? (
                    <Text style={styles.emptyText}>No orders yet</Text>
                ) : (
                    orders.map(order => (
                        <View key={order.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.orderId}>Order #{order.id}</Text>
                                    <Text style={styles.customerName}>{order.customerName}</Text>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>{order.status}</Text>
                                </View>
                            </View>

                            <View style={styles.itemsList}>
                                {order.items.map((item, idx) => (
                                    <Text key={idx} style={styles.itemRow}>
                                        • {item.quantity}x {item.menuItem?.title || 'Item'}
                                    </Text>
                                ))}
                            </View>

                            <View style={styles.footer}>
                                <Text style={styles.totalText}>Total: LKR {order.totalPrice}</Text>

                                {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                                    <TouchableOpacity
                                        style={styles.nextButton}
                                        onPress={() => handleUpdateStatus(order.id, order.status)}
                                    >
                                        <Text style={styles.nextButtonText}>Move to Next Stage</Text>
                                        <Ionicons name="arrow-forward" size={16} color="#FFF" />
                                    </TouchableOpacity>
                                )}
                            </View>
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
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    orderId: { fontSize: 14, color: '#666', fontWeight: 'bold' },
    customerName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    itemsList: { marginBottom: 16 },
    itemRow: { fontSize: 15, color: '#444', marginBottom: 4 },
    footer: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalText: { fontSize: 16, fontWeight: 'bold', color: Colors.light.tint },
    nextButton: { backgroundColor: Colors.light.tint, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
    nextButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
});
