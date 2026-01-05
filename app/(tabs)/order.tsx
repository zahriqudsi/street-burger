/**
 * Street Burger - Order Screen
 */

import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { Typography } from '@/src/constants/typography';
import { restaurantService } from '@/src/services';
import { RestaurantInfo } from '@/src/types';
import React, { useEffect, useState } from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const DeliveryOption = ({
    icon,
    title,
    subtitle,
    color,
    onPress,
}: {
    icon: string;
    title: string;
    subtitle: string;
    color: string;
    onPress: () => void;
}) => (
    <TouchableOpacity style={[styles.deliveryCard, { borderColor: color }]} onPress={onPress}>
        <View style={[styles.deliveryIcon, { backgroundColor: color }]}>
            <Text style={styles.deliveryIconText}>{icon}</Text>
        </View>
        <View style={styles.deliveryContent}>
            <Text style={styles.deliveryTitle}>{title}</Text>
            <Text style={styles.deliverySubtitle}>{subtitle}</Text>
        </View>
        <Text style={styles.deliveryArrow}>→</Text>
    </TouchableOpacity>
);

export default function OrderScreen() {
    const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const info = await restaurantService.getInfo();
                setRestaurantInfo(info);
            } catch (error) {
                console.log('Error fetching restaurant info:', error);
            }
        };
        fetchInfo();
    }, []);

    const openUrl = (url?: string) => {
        if (url) {
            Linking.openURL(url);
        } else {
            Linking.openURL('https://www.ubereats.com');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerEmoji}>🛒</Text>
                <Text style={styles.headerTitle}>Order Online</Text>
                <Text style={styles.headerSubtitle}>
                    Get your favorite Street Burger delivered right to your doorstep!
                </Text>
            </View>

            {/* Delivery Options */}
            <View style={styles.options}>
                <DeliveryOption
                    icon="🚗"
                    title="Uber Eats"
                    subtitle="Fast delivery, easy tracking"
                    color="#06C167"
                    onPress={() => openUrl(restaurantInfo?.uberEatsUrl)}
                />

                <DeliveryOption
                    icon="🛵"
                    title="PickMe Food"
                    subtitle="Local delivery service"
                    color="#FF5722"
                    onPress={() => openUrl(restaurantInfo?.pickmeFoodUrl)}
                />
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>How It Works</Text>

                <View style={styles.step}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>1</Text>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Choose Your Platform</Text>
                        <Text style={styles.stepDesc}>
                            Select Uber Eats or PickMe Food based on your preference
                        </Text>
                    </View>
                </View>

                <View style={styles.step}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>2</Text>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Browse & Order</Text>
                        <Text style={styles.stepDesc}>
                            Browse our full menu and add items to your cart
                        </Text>
                    </View>
                </View>

                <View style={styles.step}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>3</Text>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Enjoy Your Meal</Text>
                        <Text style={styles.stepDesc}>
                            Sit back and enjoy fresh Street Burger at home!
                        </Text>
                    </View>
                </View>
            </View>

            {/* Call to Action */}
            <View style={styles.callSection}>
                <Text style={styles.callTitle}>Prefer to call?</Text>
                <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => restaurantInfo?.phone && Linking.openURL(`tel:${restaurantInfo.phone}`)}
                >
                    <Text style={styles.callButtonIcon}>📞</Text>
                    <Text style={styles.callButtonText}>
                        {restaurantInfo?.phone || 'Call Us'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    content: {
        padding: Spacing.screenPadding,
        paddingBottom: 100,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        paddingTop: 20,
    },
    headerEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    headerTitle: {
        ...Typography.styles.h2,
        color: Colors.light.text,
        marginBottom: 8,
    },
    headerSubtitle: {
        ...Typography.styles.body,
        color: Colors.light.textSecondary,
        textAlign: 'center',
    },
    options: {
        gap: 16,
        marginBottom: 32,
    },
    deliveryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.surface,
        padding: 20,
        borderRadius: Spacing.borderRadius.xl,
        borderWidth: 2,
        ...Spacing.shadow.md,
    },
    deliveryIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    deliveryIconText: {
        fontSize: 28,
    },
    deliveryContent: {
        flex: 1,
    },
    deliveryTitle: {
        ...Typography.styles.h4,
        color: Colors.light.text,
        marginBottom: 2,
    },
    deliverySubtitle: {
        ...Typography.styles.bodySmall,
        color: Colors.light.textSecondary,
    },
    deliveryArrow: {
        fontSize: 24,
        color: Colors.light.textTertiary,
    },
    infoSection: {
        backgroundColor: Colors.light.surface,
        padding: Spacing.cardPadding,
        borderRadius: Spacing.borderRadius.xl,
        marginBottom: 24,
        ...Spacing.shadow.sm,
    },
    infoTitle: {
        ...Typography.styles.h5,
        color: Colors.light.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    step: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    stepNumberText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        ...Typography.styles.label,
        color: Colors.light.text,
        marginBottom: 2,
    },
    stepDesc: {
        ...Typography.styles.bodySmall,
        color: Colors.light.textSecondary,
    },
    callSection: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.light.surface,
        borderRadius: Spacing.borderRadius.xl,
        ...Spacing.shadow.sm,
    },
    callTitle: {
        ...Typography.styles.body,
        color: Colors.light.textSecondary,
        marginBottom: 12,
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.success,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: Spacing.borderRadius.lg,
        gap: 8,
    },
    callButtonIcon: {
        fontSize: 20,
    },
    callButtonText: {
        ...Typography.styles.button,
        color: '#FFFFFF',
    },
});
