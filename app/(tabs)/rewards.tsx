/**
 * Street Burger - Rewards Screen
 */

import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { Typography } from '@/src/constants/typography';
import { useAuth } from '@/src/contexts/AuthContext';
import { rewardService } from '@/src/services';
import { RewardPoints, RewardsResponse } from '@/src/types';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Login Required View
const LoginRequired = ({ onPress }: { onPress: () => void }) => (
    <View style={styles.loginRequired}>
        <Text style={styles.loginEmoji}>🎁</Text>
        <Text style={styles.loginTitle}>Join Our Rewards Program</Text>
        <Text style={styles.loginSubtitle}>
            Login to earn points and unlock exclusive rewards!
        </Text>
        <TouchableOpacity style={styles.loginButton} onPress={onPress}>
            <Text style={styles.loginButtonText}>Login Now</Text>
        </TouchableOpacity>
    </View>
);

// Points Display
const PointsDisplay = ({ points }: { points: number }) => (
    <View style={styles.pointsCard}>
        <Text style={styles.pointsLabel}>Your Points</Text>
        <Text style={styles.pointsValue}>{points}</Text>
        <Text style={styles.pointsSubtext}>Keep earning to unlock rewards!</Text>
    </View>
);

// Transaction Card
const TransactionCard = ({ transaction }: { transaction: RewardPoints }) => {
    const typeIcons: Record<string, string> = {
        EARNED: '⬆️',
        REDEEMED: '⬇️',
        BONUS: '🎉',
        ADMIN_ADD: '🎁',
    };

    const typeColors: Record<string, string> = {
        EARNED: Colors.success,
        REDEEMED: Colors.error,
        BONUS: Colors.warning,
        ADMIN_ADD: Colors.primary,
    };

    return (
        <View style={styles.transactionCard}>
            <View style={styles.transactionIcon}>
                <Text style={styles.transactionIconText}>
                    {typeIcons[transaction.transactionType] || '📝'}
                </Text>
            </View>
            <View style={styles.transactionContent}>
                <Text style={styles.transactionDescription}>
                    {transaction.description || transaction.transactionType}
                </Text>
                <Text style={styles.transactionDate}>
                    {new Date(transaction.createdAt).toLocaleDateString()}
                </Text>
            </View>
            <Text
                style={[
                    styles.transactionPoints,
                    { color: typeColors[transaction.transactionType] || Colors.light.text },
                ]}
            >
                {transaction.transactionType === 'REDEEMED' ? '-' : '+'}
                {transaction.points}
            </Text>
        </View>
    );
};

// How to Earn Section
const HowToEarn = () => (
    <View style={styles.howToEarn}>
        <Text style={styles.howToEarnTitle}>How to Earn Points</Text>
        <View style={styles.earnItem}>
            <Text style={styles.earnIcon}>🍔</Text>
            <View style={styles.earnContent}>
                <Text style={styles.earnLabel}>Dine with us</Text>
                <Text style={styles.earnDesc}>1 point for every Rs. 100 spent</Text>
            </View>
        </View>
        <View style={styles.earnItem}>
            <Text style={styles.earnIcon}>📝</Text>
            <View style={styles.earnContent}>
                <Text style={styles.earnLabel}>Write a review</Text>
                <Text style={styles.earnDesc}>10 points per review</Text>
            </View>
        </View>
        <View style={styles.earnItem}>
            <Text style={styles.earnIcon}>📅</Text>
            <View style={styles.earnContent}>
                <Text style={styles.earnLabel}>Make reservations</Text>
                <Text style={styles.earnDesc}>5 points per reservation</Text>
            </View>
        </View>
        <View style={styles.earnItem}>
            <Text style={styles.earnIcon}>🎂</Text>
            <View style={styles.earnContent}>
                <Text style={styles.earnLabel}>Birthday bonus</Text>
                <Text style={styles.earnDesc}>50 bonus points on your birthday</Text>
            </View>
        </View>
    </View>
);

export default function RewardsScreen() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [rewards, setRewards] = useState<RewardsResponse | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchRewards = async () => {
        try {
            const data = await rewardService.getMyRewards();
            setRewards(data);
        } catch (error) {
            console.log('Error fetching rewards:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchRewards();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchRewards();
        setRefreshing(false);
    };

    if (!isAuthenticated) {
        return <LoginRequired onPress={() => router.push('/(auth)/login')} />;
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Points Display */}
            <PointsDisplay points={rewards?.totalPoints || 0} />

            {/* Transaction History */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Points History</Text>
                {rewards?.history && rewards.history.length > 0 ? (
                    rewards.history.map((transaction) => (
                        <TransactionCard key={transaction.id} transaction={transaction} />
                    ))
                ) : (
                    <View style={styles.emptyHistory}>
                        <Text style={styles.emptyText}>No transactions yet</Text>
                        <Text style={styles.emptySubtext}>
                            Start earning points today!
                        </Text>
                    </View>
                )}
            </View>

            {/* How to Earn */}
            <HowToEarn />
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
    loginRequired: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.screenPadding,
    },
    loginEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    loginTitle: {
        ...Typography.styles.h3,
        color: Colors.light.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    loginSubtitle: {
        ...Typography.styles.body,
        color: Colors.light.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    loginButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: Spacing.borderRadius.lg,
    },
    loginButtonText: {
        ...Typography.styles.button,
        color: '#FFFFFF',
    },
    pointsCard: {
        backgroundColor: Colors.primary,
        padding: 24,
        borderRadius: Spacing.borderRadius.xl,
        alignItems: 'center',
        marginBottom: 24,
        ...Spacing.shadow.lg,
    },
    pointsLabel: {
        ...Typography.styles.body,
        color: '#FFFFFF',
        opacity: 0.9,
        marginBottom: 8,
    },
    pointsValue: {
        fontSize: 56,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    pointsSubtext: {
        ...Typography.styles.bodySmall,
        color: '#FFFFFF',
        opacity: 0.8,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        ...Typography.styles.h5,
        color: Colors.light.text,
        marginBottom: 12,
    },
    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.surface,
        padding: Spacing.cardPadding,
        borderRadius: Spacing.borderRadius.lg,
        marginBottom: 8,
        ...Spacing.shadow.sm,
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.surfaceSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    transactionIconText: {
        fontSize: 18,
    },
    transactionContent: {
        flex: 1,
    },
    transactionDescription: {
        ...Typography.styles.body,
        color: Colors.light.text,
    },
    transactionDate: {
        ...Typography.styles.caption,
        color: Colors.light.textSecondary,
    },
    transactionPoints: {
        ...Typography.styles.h5,
        fontWeight: '700',
    },
    emptyHistory: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: Colors.light.surface,
        borderRadius: Spacing.borderRadius.lg,
    },
    emptyText: {
        ...Typography.styles.body,
        color: Colors.light.text,
    },
    emptySubtext: {
        ...Typography.styles.caption,
        color: Colors.light.textSecondary,
    },
    howToEarn: {
        backgroundColor: Colors.light.surface,
        padding: Spacing.cardPadding,
        borderRadius: Spacing.borderRadius.xl,
        ...Spacing.shadow.sm,
    },
    howToEarnTitle: {
        ...Typography.styles.h5,
        color: Colors.light.text,
        marginBottom: 16,
    },
    earnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    earnIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    earnContent: {
        flex: 1,
    },
    earnLabel: {
        ...Typography.styles.label,
        color: Colors.light.text,
    },
    earnDesc: {
        ...Typography.styles.caption,
        color: Colors.light.textSecondary,
    },
});
