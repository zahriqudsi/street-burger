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
import { useAppColors } from '@/src/hooks/useAppColors';
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
    const colors = useAppColors();
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
            <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                <Ionicons name="lock-closed-outline" size={64} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>Please login to view orders</Text>
                <TouchableOpacity style={[styles.loginBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={() => router.push('/(auth)/login')}>
                    <Text style={[styles.loginBtnText, { color: colors.white }]}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
            >
                {orders.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="receipt-outline" size={64} color={colors.textMuted} />
                        <Text style={[styles.emptyText, { color: colors.textMuted }]}>No orders yet</Text>
                        <TouchableOpacity style={[styles.shopBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={() => router.push('/(tabs)/menu')}>
                            <Text style={[styles.shopBtnText, { color: colors.white }]}>Browse Menu</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    orders.map((order) => (
                        <View key={order.id} style={[styles.orderCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow, borderColor: colors.bgLight }]}>
                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={[styles.orderId, { color: colors.textMain }]}>Order #{order.id}</Text>
                                    <Text style={[styles.orderDate, { color: colors.textMuted }]}>
                                        {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[order.status] || colors.bgLight }]}>
                                    <Text style={[styles.statusText, { color: colors.white }]}>{order.status.replace(/_/g, ' ')}</Text>
                                </View>
                            </View>

                            <View style={[styles.divider, { backgroundColor: colors.bgLight }]} />

                            <View style={styles.itemsList}>
                                {order.items?.map((item) => (
                                    <View key={item.id} style={styles.itemRow}>
                                        <Text style={[styles.itemQty, { color: colors.primary }]}>{item.quantity}x</Text>
                                        <Text style={[styles.itemName, { color: colors.textMain }]} numberOfLines={1}>
                                            {item.menuItem?.title || 'Unknown Item'}
                                        </Text>
                                        <Text style={[styles.itemPrice, { color: colors.textMuted }]}>{formatRs(item.price * item.quantity)}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={[styles.divider, { backgroundColor: colors.bgLight }]} />

                            <View style={styles.cardFooter}>
                                <View style={[styles.typeBadge, { backgroundColor: colors.bgLight }]}>
                                    <Ionicons
                                        name={order.orderType === 'DELIVERY' ? 'bicycle' : 'restaurant'}
                                        size={12}
                                        color={colors.textMuted}
                                    />
                                    <Text style={[styles.typeText, { color: colors.textMuted }]}>{order.orderType}</Text>
                                </View>
                                <Text style={[styles.totalAmount, { color: colors.primary }]}>{formatRs(order.totalAmount)}</Text>
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
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 80,
    },
    emptyText: {
        fontSize: Typography.fontSize.lg,
        marginTop: 16,
        marginBottom: 24,
        fontWeight: '600',
    },
    loginBtn: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 20,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    loginBtnText: {
        fontWeight: '800',
        fontSize: Typography.fontSize.base,
    },
    shopBtn: {
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 20,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    shopBtnText: {
        fontWeight: '800',
        fontSize: Typography.fontSize.base,
    },
    orderCard: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    orderId: {
        fontSize: Typography.fontSize.md,
        fontWeight: '800',
    },
    orderDate: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
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
    divider: {
        height: 1,
        marginVertical: 16,
    },
    itemsList: {
        gap: 10,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemQty: {
        width: 28,
        fontWeight: '800',
        fontSize: 14,
    },
    itemName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '500',
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
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 6,
    },
    typeText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    totalAmount: {
        fontSize: Typography.fontSize.lg,
        fontWeight: '800',
    },
});
