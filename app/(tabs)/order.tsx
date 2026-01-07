/**
 * Street Burger - My Orders Screen
 */

import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { Typography } from '@/src/constants/typography';
import { useAuth } from '@/src/contexts/AuthContext';
import { orderService } from '@/src/services/orders';
import { Order } from '@/src/types';
import { formatRs } from '@/src/utils/format';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const STATUS_COLORS: Record<string, string> = {
    PENDING: '#FFA502',
    CONFIRMED: '#2ED573',
    PREPARING: '#1E90FF',
    OUT_FOR_DELIVERY: '#70A1FF',
    READY_FOR_PICKUP: '#2ED573',
    DELIVERED: '#7bed9f',
    COMPLETED: '#2f3542',
    CANCELLED: '#FF4757',
};

export default function OrderScreen() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getMyOrders();
            setOrders(data || []);
        } catch (error) {
            console.log('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const onRefresh = async () => {
        setRefreshing(true);
        if (isAuthenticated) await fetchOrders();
        setRefreshing(false);
    };

    if (!isAuthenticated) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="lock-closed-outline" size={64} color={Colors.light.textSecondary} />
                <Text style={styles.emptyText}>Please login to view orders</Text>
                <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/(auth)/login')}>
                    <Text style={styles.loginBtnText}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {orders.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="receipt-outline" size={64} color={Colors.light.textSecondary} />
                        <Text style={styles.emptyText}>No orders yet</Text>
                        <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('/(tabs)/menu')}>
                            <Text style={styles.shopBtnText}>Browse Menu</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    orders.map((order) => (
                        <View key={order.id} style={styles.orderCard}>
                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.orderId}>Order #{order.id}</Text>
                                    <Text style={styles.orderDate}>
                                        {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[order.status] || '#CCC' }]}>
                                    <Text style={styles.statusText}>{order.status.replace(/_/g, ' ')}</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.itemsList}>
                                {order.items?.map((item) => (
                                    <View key={item.id} style={styles.itemRow}>
                                        <Text style={styles.itemQty}>{item.quantity}x</Text>
                                        <Text style={styles.itemName} numberOfLines={1}>
                                            {item.menuItem?.title || 'Unknown Item'}
                                        </Text>
                                        <Text style={styles.itemPrice}>{formatRs(item.price * item.quantity)}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.cardFooter}>
                                <View style={styles.typeBadge}>
                                    <Ionicons
                                        name={order.orderType === 'DELIVERY' ? 'bicycle' : 'restaurant'}
                                        size={12}
                                        color={Colors.light.textSecondary}
                                    />
                                    <Text style={styles.typeText}>{order.orderType}</Text>
                                </View>
                                <Text style={styles.totalAmount}>{formatRs(order.totalAmount)}</Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.background,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: Spacing.screenPadding,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        ...Typography.styles.body,
        color: Colors.light.textSecondary,
        marginTop: 16,
        marginBottom: 24,
    },
    loginBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    loginBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    shopBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    shopBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    orderCard: {
        backgroundColor: Colors.light.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        ...Spacing.shadow.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    orderId: {
        ...Typography.styles.h5,
        color: Colors.light.text,
    },
    orderDate: {
        ...Typography.styles.caption,
        color: Colors.light.textSecondary,
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F2F6',
        marginVertical: 12,
    },
    itemsList: {
        gap: 8,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemQty: {
        width: 24,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    itemName: {
        flex: 1,
        fontSize: 14,
        color: Colors.light.text,
    },
    itemPrice: {
        fontSize: 14,
        color: Colors.light.textSecondary,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F2F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    typeText: {
        fontSize: 10,
        color: Colors.light.textSecondary,
        fontWeight: '600',
    },
    totalAmount: {
        ...Typography.styles.h5,
        color: Colors.primary,
    },
});
