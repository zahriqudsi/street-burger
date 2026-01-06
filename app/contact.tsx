import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Linking,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/constants/colors';
import { restaurantService, RestaurantInfo } from '@/src/services/restaurant';
import { BackButton } from '@/components/BackButton';

export default function ContactScreen() {
    const [info, setInfo] = useState<RestaurantInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await restaurantService.getAll();
            if (res.data && res.data.length > 0) {
                setInfo(res.data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch restaurant info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCall = () => {
        if (info?.phone) Linking.openURL(`tel:${info.phone}`);
    };

    const handleEmail = () => {
        if (info?.email) Linking.openURL(`mailto:${info.email}`);
    };

    const handleSocial = (url?: string) => {
        if (url) Linking.openURL(url);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    const contactMethods = [
        { id: 'phone', title: 'Call Us', value: info?.phone, icon: 'call', action: handleCall, color: '#48BB78' },
        { id: 'email', title: 'Email Us', value: info?.email, icon: 'mail', action: handleEmail, color: '#4299E1' },
    ];

    const deliveryMethods = [
        { id: 'uber', title: 'Uber Eats', icon: 'bicycle', action: () => handleSocial(info?.uberEatsUrl), color: '#000' },
        { id: 'pickme', title: 'PickMe Food', icon: 'car', action: () => handleSocial(info?.pickmeFoodUrl), color: '#3182CE' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                title: 'Contact Us',
                headerLeft: () => <BackButton />
            }} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerTitle}>Get In Touch</Text>
                <Text style={styles.headerSubtitle}>We'd love to hear from you. Choose your preferred way to reach out.</Text>

                <View style={styles.section}>
                    {contactMethods.map((method) => (
                        <TouchableOpacity key={method.id} style={styles.methodCard} onPress={method.action}>
                            <View style={[styles.methodIcon, { backgroundColor: method.color + '15' }]}>
                                <Ionicons name={method.icon as any} size={24} color={method.color} />
                            </View>
                            <View style={styles.methodContent}>
                                <Text style={styles.methodTitle}>{method.title}</Text>
                                <Text style={styles.methodValue}>{method.value}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionLabel}>Order Delivery</Text>
                <View style={styles.deliveryContainer}>
                    {deliveryMethods.map((method) => (
                        <TouchableOpacity key={method.id} style={styles.deliveryCard} onPress={method.action}>
                            <Ionicons name={method.icon as any} size={28} color={method.color} />
                            <Text style={styles.deliveryText}>{method.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionLabel}>Follow Our Street Life</Text>
                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocial(info?.facebookUrl)}>
                        <Ionicons name="logo-facebook" size={32} color="#1877F2" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocial(info?.instagramUrl)}>
                        <Ionicons name="logo-instagram" size={32} color="#E4405F" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocial('https://whatsapp.com')}>
                        <Ionicons name="logo-whatsapp" size={32} color="#25D366" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.vibeText}>Keep calm and stay hungry! 🍔🔥</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#718096',
        lineHeight: 24,
        marginBottom: 32,
    },
    section: {
        marginBottom: 40,
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        padding: 20,
        borderRadius: 20,
        marginBottom: 16,
    },
    methodIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    methodContent: {
        flex: 1,
        marginLeft: 16,
    },
    methodTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#718096',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    methodValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 16,
    },
    deliveryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    deliveryCard: {
        flex: 0.48,
        backgroundColor: '#F7FAFC',
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deliveryText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2D3748',
        marginTop: 12,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 30,
        marginBottom: 40,
    },
    socialBtn: {
        padding: 10,
    },
    vibeText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#CBD5E0',
        fontStyle: 'italic',
        fontWeight: '500',
        paddingBottom: 20,
    },
});
