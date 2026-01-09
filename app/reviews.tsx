import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { reviewService, Review } from '@/src/services/reviews';
import { BackButton } from '@/components/BackButton';
import { useAuth } from '@/src/contexts/AuthContext';
import { format } from 'date-fns';

export default function ReviewsScreen() {
    const { user, isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async () => {
        if (!comment.trim()) return;

        setIsSubmitting(true);
        try {
            const phone = user?.phoneNumber || "0000000000";
            await reviewService.add(phone, {
                reviewerName: user?.name,
                rating,
                comment
            });
            setIsModalVisible(false);
            setComment('');
            setRating(5);
            fetchData();
        } catch (error) {
            console.error('Failed to add review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (count: number, size = 16) => {
        return (
            <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                    <Ionicons
                        key={s}
                        name={s <= count ? "star" : "star-outline"}
                        size={size}
                        color={s <= count ? "#FFD700" : "#CBD5E0"}
                    />
                ))}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                headerShown: true,
                title: 'Customer Reviews',
                headerTitleStyle: { color: Colors.textMain, fontWeight: '800' },
                headerStyle: { backgroundColor: Colors.white },
                headerTransparent: false,
                headerTintColor: Colors.textMain,
                headerLeft: () => <BackButton color={Colors.textMain} />
            }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>What people say</Text>
                    <View style={styles.overallContainer}>
                        <Text style={styles.overallValue}>4.8</Text>
                        <View style={styles.overallStars}>
                            {renderStars(5, 20)}
                            <Text style={styles.overallTotal}>Based on {reviews.length} reviews</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => isAuthenticated ? setIsModalVisible(true) : null}
                    >
                        <Text style={styles.addBtnText}>
                            {isAuthenticated ? 'Write a Review' : 'Login to Write a Review'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {reviews.map((review) => (
                    <View key={review.id} style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{review.reviewerName[0].toUpperCase()}</Text>
                            </View>
                            <View style={styles.reviewInfo}>
                                <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                                <Text style={styles.reviewDate}>
                                    {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                                </Text>
                            </View>
                            {renderStars(review.rating)}
                        </View>
                        <Text style={styles.comment}>{review.comment}</Text>
                    </View>
                ))}
            </ScrollView>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Share Your Experience</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#718096" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.ratingSelector}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                                    <Ionicons
                                        name={s <= rating ? "star" : "star-outline"}
                                        size={40}
                                        color={s <= rating ? "#FFD700" : "#CBD5E0"}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={styles.textInput}
                            placeholder="Tell us what you loved..."
                            multiline
                            numberOfLines={4}
                            value={comment}
                            onChangeText={setComment}
                        />

                        <TouchableOpacity
                            style={[styles.submitBtn, !comment.trim() && styles.submitBtnDisabled]}
                            onPress={handleSubmit}
                            disabled={isSubmitting || !comment.trim()}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.submitBtnText}>Submit Review</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
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
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    summaryCard: {
        backgroundColor: Colors.primary,
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    summaryTitle: {
        fontSize: Typography.fontSize.md,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    overallContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    overallValue: {
        fontSize: 56,
        fontWeight: '900',
        color: Colors.white,
        marginRight: 20,
    },
    overallStars: {
        justifyContent: 'center',
    },
    overallTotal: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 6,
        fontWeight: '600',
    },
    starsRow: {
        flexDirection: 'row',
        gap: 2,
    },
    addBtn: {
        backgroundColor: Colors.white,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    addBtnText: {
        color: Colors.primary,
        fontWeight: '800',
        fontSize: 16,
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
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: Colors.bgLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.primary,
    },
    reviewInfo: {
        flex: 1,
        marginLeft: 14,
    },
    reviewerName: {
        fontSize: Typography.fontSize.md,
        fontWeight: '800',
        color: Colors.textMain,
    },
    reviewDate: {
        fontSize: 12,
        color: Colors.textMuted,
        fontWeight: '600',
    },
    comment: {
        fontSize: 15,
        color: Colors.textMain,
        lineHeight: 22,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    modalTitle: {
        fontSize: Typography.fontSize.xl,
        fontWeight: '800',
        color: Colors.textMain,
    },
    ratingSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 32,
    },
    textInput: {
        backgroundColor: Colors.bgLight,
        borderRadius: 20,
        padding: 20,
        height: 140,
        textAlignVertical: 'top',
        fontSize: Typography.fontSize.base,
        color: Colors.textMain,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    submitBtn: {
        backgroundColor: Colors.primary,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    submitBtnDisabled: {
        backgroundColor: Colors.border,
    },
    submitBtnText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '800',
    },
});
