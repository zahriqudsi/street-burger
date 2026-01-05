/**
 * Street Burger - Reservation Screen
 */

import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { Typography } from '@/src/constants/typography';
import { useAuth } from '@/src/contexts/AuthContext';
import { reservationService } from '@/src/services';
import { Reservation } from '@/src/types';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Login Required View
const LoginRequired = ({ onPress }: { onPress: () => void }) => (
    <View style={styles.loginRequired}>
        <Text style={styles.loginEmoji}>🔐</Text>
        <Text style={styles.loginTitle}>Login Required</Text>
        <Text style={styles.loginSubtitle}>
            Please login to make and view your reservations
        </Text>
        <TouchableOpacity style={styles.loginButton} onPress={onPress}>
            <Text style={styles.loginButtonText}>Login Now</Text>
        </TouchableOpacity>
    </View>
);

// Reservation Card
const ReservationCard = ({
    reservation,
    onCancel
}: {
    reservation: Reservation;
    onCancel: (id: number) => void;
}) => {
    const statusColors: Record<string, string> = {
        PENDING: Colors.warning,
        CONFIRMED: Colors.success,
        CANCELLED: Colors.error,
        COMPLETED: Colors.light.textSecondary,
    };

    return (
        <View style={styles.reservationCard}>
            <View style={styles.reservationHeader}>
                <Text style={styles.reservationDate}>
                    📅 {new Date(reservation.reservationDate).toLocaleDateString()}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColors[reservation.status] }]}>
                    <Text style={styles.statusText}>{reservation.status}</Text>
                </View>
            </View>
            <View style={styles.reservationDetails}>
                <Text style={styles.reservationTime}>
                    🕐 {reservation.reservationTime}
                </Text>
                <Text style={styles.reservationGuests}>
                    👥 {reservation.guestCount} guests
                </Text>
            </View>
            {reservation.specialRequests && (
                <Text style={styles.specialRequests}>
                    📝 {reservation.specialRequests}
                </Text>
            )}
            {reservation.status === 'PENDING' && (
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => onCancel(reservation.id)}
                >
                    <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

// New Reservation Form
const NewReservationForm = ({
    onSubmit,
    isLoading
}: {
    onSubmit: (data: any) => void;
    isLoading: boolean;
}) => {
    const [guestCount, setGuestCount] = useState('2');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');

    const handleSubmit = () => {
        if (!date || !time) {
            Alert.alert('Error', 'Please fill in the date and time');
            return;
        }
        onSubmit({
            guestCount: parseInt(guestCount) || 2,
            reservationDate: date,
            reservationTime: time,
            specialRequests,
        });
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Make a Reservation</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Number of Guests</Text>
                <TextInput
                    style={styles.input}
                    value={guestCount}
                    onChangeText={setGuestCount}
                    keyboardType="numeric"
                    placeholder="2"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
                <TextInput
                    style={styles.input}
                    value={date}
                    onChangeText={setDate}
                    placeholder="2024-12-25"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Time (HH:MM)</Text>
                <TextInput
                    style={styles.input}
                    value={time}
                    onChangeText={setTime}
                    placeholder="19:00"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Special Requests (Optional)</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={specialRequests}
                    onChangeText={setSpecialRequests}
                    placeholder="Any special requirements..."
                    multiline
                    numberOfLines={3}
                />
            </View>

            <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
            >
                <Text style={styles.submitButtonText}>
                    {isLoading ? 'Booking...' : 'Book Table'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default function ReservationScreen() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const fetchReservations = async () => {
        if (!user?.phoneNumber) return;
        try {
            const data = await reservationService.getByPhone(user.phoneNumber);
            console.log('[Frontend] Fetched reservations:', JSON.stringify(data, null, 2));
            setReservations(data);
        } catch (error) {
            console.log('Error fetching reservations:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchReservations();
        }
    }, [isAuthenticated, user]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchReservations();
        setRefreshing(false);
    };

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await reservationService.create(data);
            Alert.alert('Success', 'Reservation created successfully!');
            setShowForm(false);
            fetchReservations();
        } catch (error) {
            Alert.alert('Error', 'Failed to create reservation');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = async (id: number) => {
        Alert.alert(
            'Cancel Reservation',
            'Are you sure you want to cancel this reservation?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await reservationService.cancel(id);
                            fetchReservations();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to cancel reservation');
                        }
                    },
                },
            ]
        );
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
            {/* Toggle Form Button */}
            <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowForm(!showForm)}
            >
                <Text style={styles.toggleButtonText}>
                    {showForm ? '← View My Reservations' : '+ New Reservation'}
                </Text>
            </TouchableOpacity>

            {showForm ? (
                <NewReservationForm onSubmit={handleSubmit} isLoading={isSubmitting} />
            ) : (
                <View>
                    <Text style={styles.sectionTitle}>My Reservations</Text>
                    {reservations.length > 0 ? (
                        reservations.map((reservation) => (
                            <ReservationCard
                                key={reservation.id}
                                reservation={reservation}
                                onCancel={handleCancel}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyEmoji}>📅</Text>
                            <Text style={styles.emptyText}>No reservations yet</Text>
                            <Text style={styles.emptySubtext}>
                                Make your first reservation today!
                            </Text>
                        </View>
                    )}
                </View>
            )}
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
    toggleButton: {
        backgroundColor: Colors.primary,
        padding: 14,
        borderRadius: Spacing.borderRadius.lg,
        alignItems: 'center',
        marginBottom: 20,
    },
    toggleButtonText: {
        ...Typography.styles.button,
        color: '#FFFFFF',
    },
    sectionTitle: {
        ...Typography.styles.h4,
        color: Colors.light.text,
        marginBottom: 16,
    },
    reservationCard: {
        backgroundColor: Colors.light.surface,
        padding: Spacing.cardPadding,
        borderRadius: Spacing.borderRadius.lg,
        marginBottom: 12,
        ...Spacing.shadow.sm,
    },
    reservationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reservationDate: {
        ...Typography.styles.h5,
        color: Colors.light.text,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: Spacing.borderRadius.sm,
    },
    statusText: {
        fontSize: 11,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    reservationDetails: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    reservationTime: {
        ...Typography.styles.body,
        color: Colors.light.textSecondary,
    },
    reservationGuests: {
        ...Typography.styles.body,
        color: Colors.light.textSecondary,
    },
    specialRequests: {
        ...Typography.styles.bodySmall,
        color: Colors.light.textTertiary,
        fontStyle: 'italic',
    },
    cancelButton: {
        marginTop: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: Colors.error,
        borderRadius: Spacing.borderRadius.md,
        alignItems: 'center',
    },
    cancelButtonText: {
        ...Typography.styles.buttonSmall,
        color: Colors.error,
    },
    formContainer: {
        backgroundColor: Colors.light.surface,
        padding: Spacing.cardPadding,
        borderRadius: Spacing.borderRadius.xl,
        ...Spacing.shadow.md,
    },
    formTitle: {
        ...Typography.styles.h4,
        color: Colors.light.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        ...Typography.styles.label,
        color: Colors.light.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.light.background,
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: Spacing.borderRadius.md,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        color: Colors.light.text,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        borderRadius: Spacing.borderRadius.lg,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        ...Typography.styles.button,
        color: '#FFFFFF',
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        ...Typography.styles.h5,
        color: Colors.light.text,
        marginBottom: 4,
    },
    emptySubtext: {
        ...Typography.styles.body,
        color: Colors.light.textSecondary,
    },
});
