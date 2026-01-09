/**
 * Street Burger - Reservation Screen
 */

import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    RefreshControl,
    ImageBackground,
    Dimensions,
    Platform,
    Modal,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useAppColors } from '@/src/hooks/useAppColors';
import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { Typography } from '@/src/constants/typography';
import { useAuth } from '@/src/contexts/AuthContext';
import { reservationService } from '@/src/services';
import { Reservation } from '@/src/types';
import { BackButton } from '@/components/BackButton';

const { width } = Dimensions.get('window');

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function ReservationScreen() {
    const colors = useAppColors();
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'book' | 'history'>('book');

    const [guestCount, setGuestCount] = useState(2);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [pickerDate, setPickerDate] = useState(new Date());

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            const newDate = new Date(pickerDate);
            newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            setPickerDate(newDate);
            setDate(format(selectedDate, 'yyyy-MM-dd'));
        }
    };

    const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
        }
        if (selectedTime) {
            const newDate = new Date(pickerDate);
            newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
            setPickerDate(newDate);
            setTime(format(selectedTime, 'HH:mm'));
        }
    };

    const fetchReservations = async () => {
        if (!user?.phoneNumber) return;
        try {
            const data = await reservationService.getByPhone(user.phoneNumber);
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

    const handleSubmit = async () => {
        if (!date || !time) {
            Alert.alert('Missing Info', 'Please provide both date and time for your reservation.');
            return;
        }

        setIsSubmitting(true);
        try {
            await reservationService.create({
                guestCount,
                reservationDate: date,
                reservationTime: time,
                specialRequests,
            });
            Alert.alert('Booked!', 'Your table has been reserved. See you soon!');
            setActiveTab('history');
            fetchReservations();
            // Reset form
            setDate('');
            setTime('');
            setSpecialRequests('');
        } catch (error) {
            Alert.alert('Error', 'Failed to create reservation. Please try again.');
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
        return (
            <View style={[styles.loginRequired, { backgroundColor: colors.background }]}>
                <Ionicons name="lock-closed-outline" size={80} color={colors.primary} />
                <Text style={[styles.loginTitle, { color: colors.textMain }]}>Exclusive Experience</Text>
                <Text style={[styles.loginSubtitle, { color: colors.textMuted }]}>
                    Log in to reserve your table and enjoy the best of Street Burger.
                </Text>
                <TouchableOpacity style={[styles.loginButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={() => router.push('/(auth)/login')}>
                    <Text style={[styles.loginButtonText, { color: colors.white }]}>Log In to Book</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const statusColors: Record<string, string> = {
        PENDING: '#FFA502',
        CONFIRMED: '#2ED573',
        CANCELLED: '#FF4757',
        COMPLETED: '#747D8C',
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{
                headerShown: true,
                title: 'Reservations',
                headerTransparent: true,
                headerTintColor: colors.white,
                headerTitleStyle: { fontWeight: 'bold' },
                headerLeft: () => null
            }} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
            >
                {/* Hero Section */}
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1550966842-307956e3574c?q=80&w=2070&auto=format&fit=crop' }}
                    style={styles.hero}
                >
                    <View style={styles.heroOverlay}>
                        <Text style={styles.heroTitle}>Book A Table</Text>
                        <Text style={styles.heroSubtitle}>Experience the perfect fusion of flavors</Text>
                    </View>
                </ImageBackground>

                {/* Tab Switcher */}
                <View style={[styles.tabContainer, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'book' && [styles.activeTab, { backgroundColor: colors.primary }]]}
                        onPress={() => setActiveTab('book')}
                    >
                        <Text style={[styles.tabText, { color: colors.textMuted }, activeTab === 'book' && [styles.activeTabText, { color: colors.white }]]}>Reserve Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'history' && [styles.activeTab, { backgroundColor: colors.primary }]]}
                        onPress={() => setActiveTab('history')}
                    >
                        <Text style={[styles.tabText, { color: colors.textMuted }, activeTab === 'history' && [styles.activeTabText, { color: colors.white }]]}>My History</Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'book' ? (
                    <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow, borderColor: colors.bgLight }]}>
                        <Text style={[styles.cardTitle, { color: colors.textMain }]}>Reservation Details</Text>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textMain }]}>Number of Guests</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.guestPicker}>
                                {GUEST_OPTIONS.map((num) => (
                                    <TouchableOpacity
                                        key={num}
                                        style={[styles.guestChip, { backgroundColor: colors.bgLight, borderColor: colors.border }, guestCount === num && [styles.guestChipActive, { backgroundColor: colors.primary, borderColor: colors.primary }]]}
                                        onPress={() => setGuestCount(num)}
                                    >
                                        <Text style={[styles.guestText, { color: colors.textMain }, guestCount === num && [styles.guestTextActive, { color: colors.white }]]}>{num}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={[styles.label, { color: colors.textMain }]}>Date</Text>
                                <TouchableOpacity
                                    style={[styles.inputWrapper, { backgroundColor: colors.bgLight, borderColor: colors.border }]}
                                    onPress={() => setShowDatePicker(true)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                                    <Text style={[styles.input, { color: colors.textMain }, !date && [styles.placeholderText, { color: colors.textMuted }]]}>
                                        {date || 'Select Date'}
                                    </Text>
                                </TouchableOpacity>
                                {showDatePicker && Platform.OS === 'android' && (
                                    <DateTimePicker
                                        value={pickerDate}
                                        mode="date"
                                        display="default"
                                        onChange={onDateChange}
                                        minimumDate={new Date()}
                                    />
                                )}
                                {Platform.OS === 'ios' && (
                                    <Modal
                                        visible={showDatePicker}
                                        transparent={true}
                                        animationType="slide"
                                    >
                                        <TouchableOpacity
                                            style={styles.modalOverlay}
                                            activeOpacity={1}
                                            onPress={() => setShowDatePicker(false)}
                                        >
                                            <View style={styles.modalContent}>
                                                <View style={styles.pickerHeader}>
                                                    <Text style={styles.pickerTitle}>Select Date</Text>
                                                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                                        <Text style={styles.doneBtn}>Done</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <DateTimePicker
                                                    value={pickerDate}
                                                    mode="date"
                                                    display="inline"
                                                    onChange={onDateChange}
                                                    minimumDate={new Date()}
                                                    themeVariant="light"
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </Modal>
                                )}
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={[styles.label, { color: colors.textMain }]}>Time</Text>
                                <TouchableOpacity
                                    style={[styles.inputWrapper, { backgroundColor: colors.bgLight, borderColor: colors.border }]}
                                    onPress={() => setShowTimePicker(true)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="time-outline" size={20} color={colors.primary} />
                                    <Text style={[styles.input, { color: colors.textMain }, !time && [styles.placeholderText, { color: colors.textMuted }]]}>
                                        {time || 'Select Time'}
                                    </Text>
                                </TouchableOpacity>
                                {showTimePicker && Platform.OS === 'android' && (
                                    <DateTimePicker
                                        value={pickerDate}
                                        mode="time"
                                        display="default"
                                        onChange={onTimeChange}
                                    />
                                )}
                                {Platform.OS === 'ios' && (
                                    <Modal
                                        visible={showTimePicker}
                                        transparent={true}
                                        animationType="slide"
                                    >
                                        <TouchableOpacity
                                            style={styles.modalOverlay}
                                            activeOpacity={1}
                                            onPress={() => setShowTimePicker(false)}
                                        >
                                            <View style={styles.modalContent}>
                                                <View style={styles.pickerHeader}>
                                                    <Text style={styles.pickerTitle}>Select Time</Text>
                                                    <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                                                        <Text style={styles.doneBtn}>Done</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <DateTimePicker
                                                    value={pickerDate}
                                                    mode="time"
                                                    display="spinner"
                                                    onChange={onTimeChange}
                                                    themeVariant="light"
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </Modal>
                                )}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textMain }]}>Special Requests</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, { backgroundColor: colors.bgLight, borderRadius: 16, borderColor: colors.border, color: colors.textMain }]}
                                placeholder="Any allergies or special occasions?"
                                placeholderTextColor={colors.textTertiary}
                                multiline
                                numberOfLines={4}
                                value={specialRequests}
                                onChangeText={setSpecialRequests}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, { backgroundColor: colors.textMain, shadowColor: colors.cardShadow }, isSubmitting && { opacity: 0.7 }]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color={colors.surface} />
                            ) : (
                                <>
                                    <Text style={[styles.submitButtonText, { color: colors.white }]}>Confirm Reservation</Text>
                                    <Ionicons name="arrow-forward" size={20} color={colors.white} />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.historyContainer}>
                        {reservations.length > 0 ? (
                            reservations.sort((a, b) => b.id - a.id).map((res) => (
                                <View key={res.id} style={[styles.historyCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow, borderColor: colors.bgLight }]}>
                                    <View style={styles.historyHeader}>
                                        <View style={[styles.dateBlock, { backgroundColor: colors.primary + '15' }]}>
                                            <Text style={[styles.dateDay, { color: colors.primary }]}>{new Date(res.reservationDate).getDate()}</Text>
                                            <Text style={[styles.dateMonth, { color: colors.primary }]}>{new Date(res.reservationDate).toLocaleString('default', { month: 'short' })}</Text>
                                        </View>
                                        <View style={styles.historyInfo}>
                                            <Text style={[styles.historyTime, { color: colors.textMain }]}>{res.reservationTime}</Text>
                                            <Text style={[styles.historyGuests, { color: colors.textMuted }]}>{res.guestCount} Guests</Text>
                                        </View>
                                        <View style={[styles.statusBadge, { backgroundColor: statusColors[res.status] + '20' }]}>
                                            <Text style={[styles.statusText, { color: statusColors[res.status] }]}>{res.status}</Text>
                                        </View>
                                    </View>
                                    {res.specialRequests && (
                                        <View style={[styles.requestBox, { backgroundColor: colors.bgLight }]}>
                                            <Ionicons name="chatbox-outline" size={14} color={colors.textMuted} />
                                            <Text style={[styles.requestText, { color: colors.textMuted }]} numberOfLines={1}>{res.specialRequests}</Text>
                                        </View>
                                    )}
                                    {res.status === 'PENDING' && (
                                        <TouchableOpacity style={[styles.cancelBtn, { borderTopColor: colors.bgLight }]} onPress={() => handleCancel(res.id)}>
                                            <Text style={[styles.cancelBtnText, { color: colors.error }]}>Cancel Reservation</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="calendar-clear-outline" size={64} color={colors.border} />
                                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No reservations found</Text>
                                <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={() => setActiveTab('book')}>
                                    <Text style={[styles.emptyBtnText, { color: colors.white }]}>Book Your First Table</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    hero: {
        width: width,
        height: 280,
        justifyContent: 'flex-end',
    },
    heroOverlay: {
        padding: 24,
        paddingBottom: 40,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: '800',
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: Typography.fontSize.md,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: -30,
        borderRadius: 20,
        padding: 6,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 16,
    },
    activeTab: {
        backgroundColor: Colors.primary,
    },
    tabText: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '700',
    },
    activeTabText: {
        color: Colors.white,
    },
    card: {
        margin: 20,
        marginTop: 24,
        padding: 24,
        borderRadius: 28,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 4,
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: Typography.fontSize.xl,
        fontWeight: '800',
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '700',
        marginBottom: 12,
        marginLeft: 4,
    },
    guestPicker: {
        flexDirection: 'row',
    },
    guestChip: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderWidth: 1,
    },
    guestChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    guestText: {
        fontSize: Typography.fontSize.md,
        fontWeight: '800',
    },
    guestTextActive: {
        color: Colors.white,
    },
    row: {
        flexDirection: 'row',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: Typography.fontSize.base,
        paddingVertical: 12,
    },
    placeholderText: {
        color: Colors.textMuted,
    },
    textArea: {
        height: 100,
        paddingTop: 14,
        textAlignVertical: 'top',
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
    },
    submitButton: {
        height: 60,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        gap: 12,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    submitButtonText: {
        fontSize: Typography.fontSize.lg,
        fontWeight: '800',
    },
    historyContainer: {
        padding: 20,
    },
    historyCard: {
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
    },
    historyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateBlock: {
        width: 52,
        height: 52,
        backgroundColor: Colors.primary + '15',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    dateDay: {
        fontSize: Typography.fontSize.xl,
        fontWeight: '800',
        color: Colors.primary,
    },
    dateMonth: {
        fontSize: 10,
        fontWeight: '900',
        color: Colors.primary,
        textTransform: 'uppercase',
    },
    historyInfo: {
        flex: 1,
    },
    historyTime: {
        fontSize: Typography.fontSize.md,
        fontWeight: '800',
    },
    historyGuests: {
        fontSize: Typography.fontSize.sm,
        color: Colors.textMuted,
        marginTop: 2,
        fontWeight: '600',
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
    requestBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginTop: 12,
        gap: 8,
    },
    requestText: {
        fontSize: 12,
        color: Colors.textMuted,
        fontStyle: 'italic',
        flex: 1,
    },
    cancelBtn: {
        marginTop: 12,
        paddingVertical: 12,
        alignItems: 'center',
        borderTopWidth: 1,
    },
    cancelBtnText: {
        color: Colors.error,
        fontSize: Typography.fontSize.sm,
        fontWeight: '700',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
    },
    emptyText: {
        fontSize: Typography.fontSize.lg,
        marginTop: 16,
        marginBottom: 24,
        fontWeight: '600',
    },
    emptyBtn: {
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    emptyBtnText: {
        fontWeight: '800',
        fontSize: Typography.fontSize.base,
    },
    loginRequired: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    loginTitle: {
        fontSize: Typography.fontSize['4xl'],
        fontWeight: '800',
        marginTop: 24,
        marginBottom: 12,
    },
    loginSubtitle: {
        fontSize: Typography.fontSize.md,
        color: Colors.textMuted,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        fontWeight: '500',
    },
    loginButton: {
        paddingHorizontal: 40,
        paddingVertical: 18,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    loginButtonText: {
        fontSize: Typography.fontSize.lg,
        fontWeight: '800',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    pickerTitle: {
        fontSize: Typography.fontSize.xl,
        fontWeight: '800',
    },
    doneBtn: {
        fontSize: Typography.fontSize.md,
        fontWeight: '800',
        color: Colors.primary,
    },
});
