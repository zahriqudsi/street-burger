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
import { Colors } from '@/src/constants/colors';
import { restaurantService, RestaurantInfo } from '@/src/services/restaurant';
import { BackButton } from '@/components/BackButton';

const { width } = Dimensions.get('window');

export default function AboutScreen() {
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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerShown: true,
                title: 'About Us',
                headerTitleStyle: { color: '#fff' },
                headerStyle: { backgroundColor: '#000' },
                headerTransparent: false,
                headerTintColor: '#000',
                headerLeft: () => <BackButton />
            }} />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1550966841-3ee32931102e?q=80&w=2070' }}
                        style={styles.heroImage}
                    />
                    <View style={styles.heroOverlay}>
                        <Text style={styles.heroTitle}>{info?.name || 'Street Burger'}</Text>
                        <Text style={styles.heroSubtitle}>Crafting Gourmet Joy Since 2020</Text>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="restaurant" size={24} color={Colors.primary} />
                            <Text style={styles.sectionTitle}>Our Story</Text>
                        </View>
                        <Text style={styles.aboutText}>
                            {info?.aboutUs || "Street Burger was born from a passion for authentic, gourmet street food. We believe that a great burger is more than just a meal – it's an experience."}
                        </Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>50+</Text>
                            <Text style={styles.statLabel}>Dishes</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>15k</Text>
                            <Text style={styles.statLabel}>Fans</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>4.9/5</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="shield-checkmark" size={24} color={Colors.primary} />
                            <Text style={styles.sectionTitle}>Quality Guaranteed</Text>
                        </View>
                        <Text style={styles.aboutText}>
                            We use only the freshest, locally sourced ingredients to create unique flavor profiles that honor traditional burger culture while pushing culinary boundaries.
                        </Text>
                    </View>

                    <View style={styles.footer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071' }}
                            style={styles.footerImage}
                        />
                        <Text style={styles.footerText}>Made with ❤️ in Sri Lanka</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
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
    heroContainer: {
        height: 350,
        width: '100%',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
        padding: 24,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#E2E8F0',
        fontWeight: '500',
    },
    content: {
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1A202C',
        marginLeft: 12,
    },
    aboutText: {
        fontSize: 16,
        lineHeight: 26,
        color: '#4A5568',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F7FAFC',
        borderRadius: 20,
        padding: 24,
        marginBottom: 32,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    statLabel: {
        fontSize: 12,
        color: '#718096',
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    footer: {
        alignItems: 'center',
        marginTop: 16,
        paddingBottom: 40,
    },
    footerImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#A0AEC0',
        fontWeight: '500',
    },
});
