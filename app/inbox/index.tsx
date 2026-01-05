/**
 * Street Burger - Notifications Inbox
 */

import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { Typography } from '@/src/constants/typography';
import { notificationService } from '@/src/services';
import { Notification } from '@/src/types';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Notification Card
const NotificationCard = ({
    notification,
    onPress,
}: {
    notification: Notification;
    onPress: () => void;
}) => {
    const typeIcons: Record<string, string> = {
        PROMOTION: '🎉',
        REWARD: '🎁',
        SYSTEM: '⚙️',
        RESERVATION: '📅',
        GENERAL: '📢',
    };

    return (
        <TouchableOpacity
            style={[
                styles.notificationCard,
                !notification.isRead && styles.unreadCard,
            ]}
            onPress={onPress}
        >
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>
                    {typeIcons[notification.notificationType] || '📬'}
                </Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>
                    {notification.title}
                </Text>
                <Text style={styles.message} numberOfLines={2}>
                    {notification.message}
                </Text>
                <Text style={styles.time}>
                    {new Date(notification.createdAt).toLocaleDateString()}
                </Text>
            </View>
            {!notification.isRead && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );
};

export default function InboxScreen() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getForUser();
            setNotifications(data);
        } catch (error) {
            console.log('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
    };

    const handleNotificationPress = async (notification: Notification) => {
        if (!notification.isRead) {
            try {
                await notificationService.markAsRead(notification.id);
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notification.id ? { ...n, isRead: true } : n
                    )
                );
            } catch (error) {
                console.log('Error marking notification as read:', error);
            }
        }
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📬</Text>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtext}>
                You'll receive updates about promotions, rewards, and reservations here
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <NotificationCard
                        notification={item}
                        onPress={() => handleNotificationPress(item)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={!loading ? renderEmpty : null}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    listContent: {
        padding: Spacing.screenPadding,
        flexGrow: 1,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: Colors.light.surface,
        padding: Spacing.cardPadding,
        borderRadius: Spacing.borderRadius.lg,
        marginBottom: 12,
        ...Spacing.shadow.sm,
    },
    unreadCard: {
        backgroundColor: Colors.light.surfaceSecondary,
        borderLeftWidth: 3,
        borderLeftColor: Colors.primary,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.light.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 22,
    },
    content: {
        flex: 1,
    },
    title: {
        ...Typography.styles.label,
        color: Colors.light.text,
        marginBottom: 4,
    },
    message: {
        ...Typography.styles.bodySmall,
        color: Colors.light.textSecondary,
        marginBottom: 6,
    },
    time: {
        ...Typography.styles.caption,
        color: Colors.light.textTertiary,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
        position: 'absolute',
        top: 12,
        right: 12,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        ...Typography.styles.h4,
        color: Colors.light.text,
        marginBottom: 8,
    },
    emptySubtext: {
        ...Typography.styles.body,
        color: Colors.light.textSecondary,
        textAlign: 'center',
    },
});
