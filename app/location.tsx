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
    Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppColors } from '@/src/hooks/useAppColors';
import { restaurantService, RestaurantInfo } from '@/src/services/restaurant';
import { BackButton } from '@/components/BackButton';
import { Typography } from '@/src/constants/typography';
import { Colors as GlobalColors } from '@/src/constants/colors';

export default function LocationScreen() {
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

    const openMaps = () => {
        if (!info) return;
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${info.latitude},${info.longitude}`;
        const label = info.name;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        if (url) Linking.openURL(url);
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{
                headerShown: true,
                title: 'Our Location',
                headerTitleStyle: { color: colors.textMain, fontWeight: '800' },
                headerStyle: { backgroundColor: colors.surface },
                headerTransparent: false,
                headerTintColor: colors.textMain,
                headerLeft: () => <BackButton color={colors.textMain} />
            }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow, borderColor: colors.bgLight }]}>
                    <View style={[styles.iconCircle, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
                        <Ionicons name="location" size={32} color={colors.white} />
                    </View>

                    <Text style={[styles.title, { color: colors.textMain }]}>Visit Us</Text>
                    <Text style={[styles.address, { color: colors.textMuted }]}>{info?.address || 'Loading address...'}</Text>

                    <TouchableOpacity style={[styles.mapsButton, { backgroundColor: colors.textMain, shadowColor: colors.cardShadow }]} onPress={openMaps}>
                        <Ionicons name="navigate" size={20} color={colors.surface} />
                        <Text style={[styles.mapsButtonText, { color: colors.surface }]}>Get Directions</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow, borderColor: colors.bgLight, marginTop: 20 }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="time-outline" size={24} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Opening Hours</Text>
                    </View>

                    <View style={styles.hoursContainer}>
                        {info?.openingHours.split('\n').map((line, index) => (
                            <View key={index} style={[styles.hourRow, { borderBottomColor: colors.bgLight }]}>
                                <Text style={[styles.hourText, { color: colors.textMain }]}>{line}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={[styles.infoBox, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '20' }]}>
                    <Ionicons name="information-circle" size={24} color={colors.primary} />
                    <Text style={[styles.infoText, { color: colors.textMain }]}>
                        Order through our app for exclusive rewards and faster pickup!
                    </Text>
                </View>
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
        padding: 20,
    },
    card: {
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 2,
        borderWidth: 1,
    },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    title: {
        fontSize: Typography.fontSize.xl,
        fontWeight: '900',
        marginBottom: 12,
    },
    address: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
        fontWeight: '500',
    },
    mapsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 28,
        borderRadius: 20,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    mapsButtonText: {
        fontSize: 16,
        fontWeight: '800',
        marginLeft: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.lg,
        fontWeight: '800',
        marginLeft: 14,
    },
    hoursContainer: {
        width: '100%',
    },
    hourRow: {
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    hourText: {
        fontSize: 15,
        fontWeight: '600',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        padding: 20,
        marginTop: 32,
        borderWidth: 1,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        marginLeft: 14,
        lineHeight: 22,
        fontWeight: '600',
    },
});
