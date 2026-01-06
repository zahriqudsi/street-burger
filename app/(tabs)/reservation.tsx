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
            <View style={styles.loginRequired}>
                <Ionicons name="lock-closed-outline" size={80} color={Colors.primary} />
                <Text style={styles.loginTitle}>Exclusive Experience</Text>
                <Text style={styles.loginSubtitle}>
                    Log in to reserve your table and enjoy the best of Street Burger.
                </Text>
                <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/(auth)/login')}>
                    <Text style={styles.loginButtonText}>Log In to Book</Text>
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
        <View style={styles.container}>
            <Stack.Screen options={{
                headerShown: true,
                title: 'Reservations',
                headerTransparent: true,
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: 'bold' },
                headerLeft: () => null // Hide back button for tabs if needed, but here it's fine
            }} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'book' && styles.activeTab]}
                        onPress={() => setActiveTab('book')}
                    >
                        <Text style={[styles.tabText, activeTab === 'book' && styles.activeTabText]}>Reserve Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'history' && styles.activeTab]}
                        onPress={() => setActiveTab('history')}
                    >
                        <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>My History</Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'book' ? (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Reservation Details</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Number of Guests</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.guestPicker}>
                                {GUEST_OPTIONS.map((num) => (
                                    <TouchableOpacity
                                        key={num}
                                        style={[styles.guestChip, guestCount === num && styles.guestChipActive]}
                                        onPress={() => setGuestCount(num)}
                                    >
                                        <Text style={[styles.guestText, guestCount === num && styles.guestTextActive]}>{num}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>Date</Text>
                                <TouchableOpacity
                                    style={styles.inputWrapper}
                                    onPress={() => setShowDatePicker(true)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                                    <Text style={[styles.input, !date && styles.placeholderText]}>
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
                                <Text style={styles.label}>Time</Text>
                                <TouchableOpacity
                                    style={styles.inputWrapper}
                                    onPress={() => setShowTimePicker(true)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="time-outline" size={20} color={Colors.primary} />
                                    <Text style={[styles.input, !time && styles.placeholderText]}>
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
                            <Text style={styles.label}>Special Requests</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Any allergies or special occasions?"
                                multiline
                                numberOfLines={4}
                                value={specialRequests}
                                onChangeText={setSpecialRequests}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <>
                                    <Text style={styles.submitButtonText}>Confirm Reservation</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.historyContainer}>
                        {reservations.length > 0 ? (
                            reservations.sort((a, b) => b.id - a.id).map((res) => (
                                <View key={res.id} style={styles.historyCard}>
                                    <View style={styles.historyHeader}>
                                        <View style={styles.dateBlock}>
                                            <Text style={styles.dateDay}>{new Date(res.reservationDate).getDate()}</Text>
                                            <Text style={styles.dateMonth}>{new Date(res.reservationDate).toLocaleString('default', { month: 'short' })}</Text>
                                        </View>
                                        <View style={styles.historyInfo}>
                                            <Text style={styles.historyTime}>{res.reservationTime}</Text>
                                            <Text style={styles.historyGuests}>{res.guestCount} Guests</Text>
                                        </View>
                                        <View style={[styles.statusBadge, { backgroundColor: statusColors[res.status] + '20' }]}>
                                            <Text style={[styles.statusText, { color: statusColors[res.status] }]}>{res.status}</Text>
                                        </View>
                                    </View>
                                    {res.specialRequests && (
                                        <View style={styles.requestBox}>
                                            <Ionicons name="chatbox-outline" size={14} color="#747D8C" />
                                            <Text style={styles.requestText} numberOfLines={1}>{res.specialRequests}</Text>
                                        </View>
                                    )}
                                    {res.status === 'PENDING' && (
                                        <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(res.id)}>
                                            <Text style={styles.cancelBtnText}>Cancel Reservation</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="calendar-clear-outline" size={64} color="#CBD5E0" />
                                <Text style={styles.emptyText}>No reservations found</Text>
                                <TouchableOpacity style={styles.emptyBtn} onPress={() => setActiveTab('book')}>
                                    <Text style={styles.emptyBtnText}>Book Your First Table</Text>
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
        backgroundColor: '#F8F9FA',
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
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginTop: -25,
        borderRadius: 16,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },
    activeTab: {
        backgroundColor: Colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#747D8C',
    },
    activeTabText: {
        color: '#FFF',
    },
    card: {
        backgroundColor: '#FFF',
        margin: 20,
        marginTop: 24,
        padding: 24,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#718096',
        marginBottom: 10,
        marginLeft: 4,
    },
    guestPicker: {
        flexDirection: 'row',
    },
    guestChip: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F7FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    guestChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    guestText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A5568',
    },
    guestTextActive: {
        color: '#FFF',
    },
    row: {
        flexDirection: 'row',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 54,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#2D3748',
        paddingVertical: 12,
    },
    placeholderText: {
        color: '#A0AEC0',
    },
    textArea: {
        height: 100,
        paddingTop: 14,
        textAlignVertical: 'top',
        backgroundColor: '#F7FAFC',
        borderRadius: 14,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    submitButton: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        gap: 10,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    historyContainer: {
        padding: 20,
    },
    historyCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    historyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateBlock: {
        width: 50,
        height: 54,
        backgroundColor: Colors.primary + '15',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    dateDay: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    dateMonth: {
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.primary,
        textTransform: 'uppercase',
    },
    historyInfo: {
        flex: 1,
    },
    historyTime: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    historyGuests: {
        fontSize: 14,
        color: '#718096',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    requestBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        padding: 10,
        borderRadius: 10,
        marginTop: 12,
        gap: 8,
    },
    requestText: {
        fontSize: 12,
        color: '#747D8C',
        fontStyle: 'italic',
        flex: 1,
    },
    cancelBtn: {
        marginTop: 12,
        paddingVertical: 8,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F7FAFC',
    },
    cancelBtnText: {
        color: '#FF4757',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontSize: 18,
        color: '#718096',
        marginTop: 16,
        marginBottom: 24,
    },
    emptyBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    emptyBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    loginRequired: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    loginTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2D3748',
        marginTop: 24,
        marginBottom: 12,
    },
    loginSubtitle: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    loginButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderRadius: 18,
        width: '100%',
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingBottom: 40,
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    pickerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    doneBtn: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
    },
});
