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
import { useAppColors } from '@/src/hooks/useAppColors';
import { restaurantService, RestaurantInfo } from '@/src/services/restaurant';
import { BackButton } from '@/components/BackButton';
import { Colors as GlobalColors } from '@/src/constants/colors';

export default function ContactScreen() {
    const colors = useAppColors();
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
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const contactMethods = [
        { id: 'phone', title: 'Call Us', value: info?.phone, icon: 'call', action: handleCall, color: colors.success },
        { id: 'email', title: 'Email Us', value: info?.email, icon: 'mail', action: handleEmail, color: colors.info },
    ];

    const deliveryMethods = [
        { id: 'uber', title: 'Uber Eats', icon: 'bicycle', action: () => handleSocial(info?.uberEatsUrl), color: colors.textMain },
        { id: 'pickme', title: 'PickMe Food', icon: 'car', action: () => handleSocial(info?.pickmeFoodUrl), color: colors.info },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{
                headerShown: true,
                title: 'Contact Us',
                headerTitleStyle: { color: colors.textMain, fontWeight: '800' },
                headerStyle: { backgroundColor: colors.surface },
                headerTransparent: false,
                headerTintColor: colors.textMain,
                headerLeft: () => <BackButton color={colors.textMain} />
            }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={[styles.headerTitle, { color: colors.textMain }]}>Get In Touch</Text>
                <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>We'd love to hear from you. Choose your preferred way to reach out.</Text>

                <View style={styles.section}>
                    {contactMethods.map((method) => (
                        <TouchableOpacity key={method.id} style={[styles.methodCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow, borderColor: colors.bgLight }]} onPress={method.action}>
                            <View style={[styles.methodIcon, { backgroundColor: method.color + '15' }]}>
                                <Ionicons name={method.icon as any} size={24} color={method.color} />
                            </View>
                            <View style={styles.methodContent}>
                                <Text style={[styles.methodTitle, { color: colors.textMuted }]}>{method.title}</Text>
                                <Text style={[styles.methodValue, { color: colors.textMain }]}>{method.value}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.sectionLabel, { color: colors.textMain }]}>Order Delivery</Text>
                <View style={styles.deliveryContainer}>
                    {deliveryMethods.map((method) => (
                        <TouchableOpacity key={method.id} style={[styles.deliveryCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow, borderColor: colors.bgLight }]} onPress={method.action}>
                            <Ionicons name={method.icon as any} size={28} color={method.color} />
                            <Text style={[styles.deliveryText, { color: colors.textMain }]}>{method.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.sectionLabel, { color: colors.textMain }]}>Follow Our Street Life</Text>
                <View style={styles.socialContainer}>
                    <TouchableOpacity style={[styles.socialBtn, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]} onPress={() => handleSocial(info?.facebookUrl)}>
                        <Ionicons name="logo-facebook" size={32} color="#1877F2" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.socialBtn, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]} onPress={() => handleSocial(info?.instagramUrl)}>
                        <Ionicons name="logo-instagram" size={32} color="#E4405F" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.socialBtn, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]} onPress={() => handleSocial('https://whatsapp.com')}>
                        <Ionicons name="logo-whatsapp" size={32} color="#25D366" />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.vibeText, { color: colors.textMuted }]}>Keep calm and stay hungry! 🍔🔥</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 40,
        fontWeight: '500',
    },
    section: {
        marginBottom: 40,
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
    },
    methodIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    methodContent: {
        flex: 1,
        marginLeft: 18,
    },
    methodTitle: {
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    methodValue: {
        fontSize: 17,
        fontWeight: '700',
    },
    sectionLabel: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 20,
    },
    deliveryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    deliveryCard: {
        flex: 0.48,
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
    },
    deliveryText: {
        fontSize: 14,
        fontWeight: '800',
        marginTop: 14,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 30,
        marginBottom: 40,
    },
    socialBtn: {
        padding: 12,
        borderRadius: 20,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    vibeText: {
        textAlign: 'center',
        fontSize: 16,
        fontStyle: 'italic',
        fontWeight: '600',
        paddingBottom: 40,
    },
});
