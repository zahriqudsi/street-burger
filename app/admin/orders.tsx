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
        backgroundColor: Colors.bgLight,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.bgLight,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    customerName: {
        fontSize: Typography.fontSize.md,
        fontWeight: '800',
        color: Colors.textMain,
    },
    timeStr: {
        fontSize: 12,
        color: Colors.textMuted,
        fontWeight: '600',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statusText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    address: {
        fontSize: 13,
        color: Colors.textMain,
        marginBottom: 12,
        fontWeight: '500',
    },
    noteBox: {
        backgroundColor: Colors.bgLight,
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: Colors.error,
    },
    noteText: {
        fontSize: 12,
        color: Colors.textMain,
        fontStyle: 'italic',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.bgLight,
        marginVertical: 12,
    },
    itemsList: {
        marginBottom: 12,
        gap: 6,
    },
    itemText: {
        fontSize: 14,
        color: Colors.textMain,
        fontWeight: '600',
    },
    total: {
        fontSize: Typography.fontSize.lg,
        fontWeight: '800',
        color: Colors.primary,
        alignSelf: 'flex-end',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderRadius: 30,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    modalTitle: {
        fontSize: Typography.fontSize.xl,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 24,
        color: Colors.textMain,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    actionBtn: {
        width: '46%',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        color: Colors.white,
        fontWeight: '800',
        fontSize: 14,
        textTransform: 'uppercase',
    },
    closeBtn: {
        marginTop: 24,
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 24,
    },
    closeText: {
        color: Colors.textMuted,
        fontSize: 14,
        fontWeight: '700',
    },
});
