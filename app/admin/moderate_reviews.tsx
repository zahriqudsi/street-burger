import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { reviewService, Review } from '@/src/services/reviews';
import { format } from 'date-fns';
import { BackButton } from '@/components/BackButton';

export default function ModerateReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await reviewService.getAll();
            setReviews(res.data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        Alert.alert(
            'Delete Review',
            'Are you sure you want to delete this review permanently?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await reviewService.delete(id);
                            fetchData();
                        } catch (error) {
                            console.error('Failed to delete review:', error);
                        }
                    }
                }
            ]
        );
    };

    const renderReviewItem = ({ item }: { item: Review }) => (
        <View style={styles.reviewCard}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.reviewerName}>{item.reviewerName}</Text>
                    <Text style={styles.date}>{format(new Date(item.createdAt), 'MMM dd, HH:mm')}</Text>
                </View>
                <View style={styles.rating}>
                    <Text style={styles.ratingText}>{item.rating}</Text>
                    <Ionicons name="star" size={14} color="#FFD700" />
                </View>
            </View>
            <Text style={styles.comment}>{item.comment}</Text>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-outline" size={20} color="#FF4757" />
                    <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                title: 'Moderate Reviews',
                headerLeft: () => <BackButton />
            }} />

            <FlatList
                data={reviews}
                renderItem={renderReviewItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbubbles-outline" size={64} color="#CBD5E0" />
                        <Text style={styles.emptyText}>No reviews found to moderate.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgLight,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bgLight,
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    reviewCard: {
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
        marginBottom: 16,
    },
    reviewerName: {
        fontSize: Typography.fontSize.md,
        fontWeight: '800',
        color: Colors.textMain,
    },
    date: {
        fontSize: 12,
        color: Colors.textMuted,
        fontWeight: '600',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFD70015',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#B8860B',
        marginRight: 4,
    },
    comment: {
        fontSize: Typography.fontSize.base,
        color: Colors.textMain,
        lineHeight: 22,
        marginBottom: 20,
        fontWeight: '500',
    },
    actions: {
        borderTopWidth: 1,
        borderTopColor: Colors.bgLight,
        paddingTop: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.error + '10',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    deleteBtnText: {
        color: Colors.error,
        fontWeight: '800',
        fontSize: 14,
        marginLeft: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: Typography.fontSize.md,
        color: Colors.textMuted,
        fontWeight: '600',
    },
});
