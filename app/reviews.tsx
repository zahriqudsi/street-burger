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
                headerTitleStyle: { color: '#fff' },
                headerStyle: { backgroundColor: '#000' },
                headerTransparent: false,
                headerTintColor: '#000',
                headerLeft: () => <BackButton />
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
        backgroundColor: '#F7FAFC',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 20,
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
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 12,
    },
    overallContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    overallValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFF',
        marginRight: 16,
    },
    overallStars: {
        justifyContent: 'center',
    },
    overallTotal: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 4,
    },
    starsRow: {
        flexDirection: 'row',
    },
    addBtn: {
        backgroundColor: '#FFF',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    addBtnText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 15,
    },
    reviewCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EDF2F7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A5568',
    },
    reviewInfo: {
        flex: 1,
        marginLeft: 12,
    },
    reviewerName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    reviewDate: {
        fontSize: 12,
        color: '#A0AEC0',
    },
    comment: {
        fontSize: 14,
        color: '#4A5568',
        lineHeight: 22,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A2020',
    },
    ratingSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 24,
    },
    textInput: {
        backgroundColor: '#F7FAFC',
        borderRadius: 16,
        padding: 16,
        height: 120,
        textAlignVertical: 'top',
        fontSize: 16,
        color: '#2D3748',
        marginBottom: 24,
    },
    submitBtn: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtnDisabled: {
        backgroundColor: '#CBD5E0',
    },
    submitBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
