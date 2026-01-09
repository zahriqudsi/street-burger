import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    SafeAreaView,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppColors } from '@/src/hooks/useAppColors';
import { Typography } from '@/src/constants/typography';
import { restaurantService, RestaurantInfo } from '@/src/services/restaurant';
import { BackButton } from '@/components/BackButton';
import { Colors as GlobalColors } from '@/src/constants/colors';

const { width } = Dimensions.get('window');

export default function AboutScreen() {
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

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{
                headerShown: true,
                title: 'About Us',
                headerTitleStyle: { color: colors.textMain, fontWeight: '800' },
                headerStyle: { backgroundColor: colors.surface },
                headerTransparent: false,
                headerTintColor: colors.textMain,
                headerLeft: () => <BackButton color={colors.textMain} />
            }} />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1550966841-3ee32931102e?q=80&w=2070' }}
                        style={styles.heroImage}
                    />
                    <View style={styles.heroOverlay}>
                        <Text style={[styles.heroTitle, { color: colors.white }]}>{info?.name || 'Street Burger'}</Text>
                        <Text style={[styles.heroSubtitle, { color: colors.white }]}>Crafting Gourmet Joy Since 2020</Text>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="restaurant" size={24} color={colors.primary} />
                            <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Our Story</Text>
                        </View>
                        <Text style={[styles.aboutText, { color: colors.textMain }]}>
                            {info?.aboutUs || "Street Burger was born from a passion for authentic, gourmet street food. We believe that a great burger is more than just a meal – it's an experience."}
                        </Text>
                    </View>

                    <View style={[styles.statsContainer, { backgroundColor: colors.surface, shadowColor: colors.cardShadow, borderColor: colors.bgLight }]}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.primary }]}>50+</Text>
                            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Dishes</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.primary }]}>15k</Text>
                            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Fans</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.primary }]}>4.9/5</Text>
                            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Rating</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
                            <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Quality Guaranteed</Text>
                        </View>
                        <Text style={[styles.aboutText, { color: colors.textMain }]}>
                            We use only the freshest, locally sourced ingredients to create unique flavor profiles that honor traditional burger culture while pushing culinary boundaries.
                        </Text>
                    </View>

                    <View style={styles.footer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071' }}
                            style={styles.footerImage}
                        />
                        <Text style={[styles.footerText, { color: colors.textMuted }]}>Made with ❤️ in Sri Lanka</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
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
    heroContainer: {
        height: 400,
        width: '100%',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
        padding: 30,
    },
    heroTitle: {
        fontSize: 42,
        fontWeight: '900',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        opacity: 0.9,
    },
    content: {
        padding: 24,
    },
    section: {
        marginBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.xl,
        fontWeight: '800',
        marginLeft: 14,
    },
    aboutText: {
        fontSize: 16,
        lineHeight: 28,
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 24,
        padding: 24,
        marginBottom: 40,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 26,
        fontWeight: '900',
    },
    statLabel: {
        fontSize: 10,
        marginTop: 6,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
        paddingBottom: 60,
    },
    footerImage: {
        width: 140,
        height: 140,
        borderRadius: 30,
        marginBottom: 24,
    },
    footerText: {
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
