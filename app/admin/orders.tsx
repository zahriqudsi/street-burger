/**
 * Street Burger - Admin Order Management
 */

import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { Typography } from '@/src/constants/typography';
import { orderService } from '@/src/services/orders';
import { Order, OrderStatus } from '@/src/types';
import { formatRs } from '@/src/utils/format';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
} from 'react-native';

const STATUS_ACTIONS: { label: string; value: OrderStatus; color: string }[] = [
    { label: 'Confirm', value: 'CONFIRMED', color: '#2ED573' },
    { label: 'Prepare', value: 'PREPARING', color: '#1E90FF' },
    { label: 'Ship', value: 'OUT_FOR_DELIVERY', color: '#70A1FF' },
    { label: 'Ready', value: 'READY_FOR_PICKUP', color: '#2ED573' },
    { label: 'Complete', value: 'COMPLETED', color: '#2f3542' },
    { label: 'Cancel', value: 'CANCELLED', color: '#FF4757' },
];

export default function AdminOrdersScreen() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Status update logic
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getAll();
            setOrders(data || []);
        } catch (error) {
            console.log('Error fetching admin orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
    };

    const handleStatusUpdate = async (id: number, newStatus: OrderStatus) => {
        try {
            await orderService.updateStatus(id, newStatus);
            // Optimistic update
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
            setSelectedOrder(null);
            Alert.alert('Updated', `Order marked as ${newStatus}`);
        } catch (error) {
            Alert.alert('Error', 'Failed to update status');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />;
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Incoming Orders' }} />

            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={styles.content}
            >
                {orders.map((order) => (
                    <View key={order.id} style={styles.card}>
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.customerName}>{order.user?.name || order.phoneNumber}</Text>
                                <Text style={styles.timeStr}>{new Date(order.createdAt).toLocaleTimeString()} • {order.orderType}</Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}
                                onPress={() => setSelectedOrder(order)}
                            >
                                <Text style={styles.statusText}>{order.status}</Text>
                                <Ionicons name="chevron-down" size={12} color="#FFF" style={{ marginLeft: 4 }} />
                            </TouchableOpacity>
                        </View>

                        {order.deliveryAddress && (
                            <Text style={styles.address}>📍 {order.deliveryAddress}</Text>
                        )}

                        {order.notes && (
                            <View style={styles.noteBox}>
                                <Text style={styles.noteText}>📝 "{order.notes}"</Text>
                            </View>
                        )}

                        <View style={styles.divider} />

                        <View style={styles.itemsList}>
                            {order.items?.map((item) => (
                                <Text key={item.id} style={styles.itemText}>
                                    <Text style={{ fontWeight: 'bold' }}>{item.quantity}x </Text>
                                    {item.menuItem?.title}
                                </Text>
                            ))}
                        </View>

                        <Text style={styles.total}>{formatRs(order.totalAmount)}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Status Modal */}
            <Modal
                visible={!!selectedOrder}
                transparent={true}
                animationType="fade"
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setSelectedOrder(null)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Order #{selectedOrder?.id}</Text>
                        <View style={styles.actionsGrid}>
                            {STATUS_ACTIONS.map((action) => (
                                <TouchableOpacity
                                    key={action.value}
                                    style={[styles.actionBtn, { backgroundColor: action.color }]}
                                    onPress={() => selectedOrder && handleStatusUpdate(selectedOrder.id, action.value)}
                                >
                                    <Text style={styles.actionText}>{action.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedOrder(null)}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

function getStatusColor(status: string) {
    if (status === 'PENDING') return '#FFA502';
    if (status === 'CONFIRMED' || status === 'READY_FOR_PICKUP') return '#2ED573';
    if (status === 'CANCELLED') return '#FF4757';
    if (status === 'COMPLETED') return '#747D8C';
    return '#1E90FF';
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    content: {
        padding: 16,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        ...Spacing.shadow.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    customerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    timeStr: {
        fontSize: 12,
        color: '#718096',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    address: {
        fontSize: 13,
        color: '#4A5568',
        marginBottom: 8,
    },
    noteBox: {
        backgroundColor: '#FFF5F5',
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    noteText: {
        fontSize: 12,
        color: '#C53030',
        fontStyle: 'italic',
    },
    divider: {
        height: 1,
        backgroundColor: '#EDF2F7',
        marginVertical: 8,
    },
    itemsList: {
        marginBottom: 8,
    },
    itemText: {
        fontSize: 14,
        color: '#2D3748',
        marginBottom: 4,
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
        alignSelf: 'flex-end',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
    },
    actionBtn: {
        width: '45%',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    closeBtn: {
        marginTop: 20,
        alignSelf: 'center',
    },
    closeText: {
        color: '#718096',
        fontSize: 14,
    },
});
