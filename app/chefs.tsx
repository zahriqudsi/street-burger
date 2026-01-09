import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppColors } from '@/src/hooks/useAppColors';
import { chefService } from '../src/services';
import { Chef } from '../src/types';
import { Typography } from '../src/constants/typography';
import { Spacing } from '../src/constants/spacing';
import { Stack } from 'expo-router';
import { BackButton } from '@/components/BackButton';
import { Colors as GlobalColors } from '@/src/constants/colors';

export default function ChefsScreen() {
    const colors = useAppColors();
    const [chefs, setChefs] = useState<Chef[]>([]);
    const [loading, setLoading] = useState(true);
    const HEADER_HEIGHT = 400;

    useEffect(() => {
        fetchChefs();
    }, []);

    const fetchChefs = async () => {
        try {
            const data = await chefService.getAll();
            setChefs(data);
        } catch (error) {
            console.error('Error fetching chefs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{
                headerShown: true,
                title: 'Meet Our Chefs',
                headerTitleStyle: { color: colors.textMain, fontWeight: '800' },
                headerStyle: { backgroundColor: colors.surface },
                headerTransparent: false,
                headerTintColor: colors.textMain,
                headerLeft: () => <BackButton color={colors.textMain} />
            }} />

            {/* Fixed Hero Section */}
            <View style={[styles.heroContainer, { height: HEADER_HEIGHT }]}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070' }}
                    style={styles.heroImage}
                />
                <View style={styles.heroOverlay}>
                    <Text style={[styles.heroTitle, { color: colors.white }]}>Our Culinary Masters</Text>
                    <Text style={[styles.heroSubtitle, { color: colors.white }]}>Dedicated to Perfection in Every Bite</Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: HEADER_HEIGHT, paddingBottom: 40 }}
            >
                <View style={styles.content}>
                    {chefs.length > 0 ? (
                        chefs.map((chef) => (
                            <View key={chef.id} style={[styles.chefCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow, borderColor: colors.bgLight }]}>
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={{ uri: chef.imageUrl?.startsWith('http') ? chef.imageUrl : `http://192.168.99.121:8080/images/${chef.imageUrl}` }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View style={styles.chefInfo}>
                                    <Text style={[styles.chefName, { color: colors.textMain }]}>{chef.name}</Text>
                                    <View style={[styles.titleBadge, { backgroundColor: colors.primary + '15' }]}>
                                        <Text style={[styles.chefTitle, { color: colors.primary }]}>{chef.title}</Text>
                                    </View>
                                    {chef.bio && <Text style={[styles.chefBio, { color: colors.textMain }]}>{chef.bio}</Text>}
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="people-outline" size={64} color={colors.textMuted} />
                            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No chefs profiles available yet.</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: -1,
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
        fontSize: 38,
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
    chefCard: {
        borderRadius: 32,
        overflow: 'hidden',
        marginBottom: 32,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
        borderWidth: 1,
    },
    imageContainer: {
        width: '100%',
        height: 300,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    chefInfo: {
        padding: 24,
    },
    chefName: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 6,
    },
    titleBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    chefTitle: {
        fontSize: 14,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    chefBio: {
        fontSize: 15,
        lineHeight: 24,
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 16,
        fontWeight: '600',
    },
});
