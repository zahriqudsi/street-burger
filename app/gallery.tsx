import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppColors } from '@/src/hooks/useAppColors';
import { galleryService } from '../src/services';
import { GalleryImage } from '../src/types';
import { Stack } from 'expo-router';
import { BackButton } from '@/components/BackButton';
import { Colors as GlobalColors } from '@/src/constants/colors';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48 - 12) / 2;

export default function GalleryScreen() {
    const colors = useAppColors();
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const data = await galleryService.getAll();
            setImages(data);
        } catch (error) {
            console.error('Error fetching gallery:', error);
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
                title: 'Our Gallery',
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
                        source={{ uri: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070' }}
                        style={styles.heroImage}
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent']}
                        style={styles.heroTopGradient}
                    />
                    <View style={styles.heroOverlay}>
                        <Text style={[styles.heroTitle, { color: colors.white }]}>Savor the Moments</Text>
                        <Text style={[styles.heroSubtitle, { color: colors.white }]}>A Visual Journey Through Our Kitchen</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <View style={styles.grid}>
                        {images.length > 0 ? (
                            images.map((img) => (
                                <View key={img.id} style={[styles.imageCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow, borderColor: colors.bgLight }]}>
                                    <Image
                                        source={{ uri: img.imageUrl.startsWith('http') ? img.imageUrl : `http://192.168.99.121:8080/images/${img.imageUrl}` }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                    {img.caption && (
                                        <View style={styles.captionContainer}>
                                            <Text style={[styles.caption, { color: colors.white }]} numberOfLines={1}>{img.caption}</Text>
                                        </View>
                                    )}
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="images-outline" size={64} color={colors.textMuted} />
                                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No images in gallery yet.</Text>
                            </View>
                        )}
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
    centerContainer: {
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
    heroTopGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    imageCard: {
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH * 1.3,
        borderRadius: 24,
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    captionContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 12,
    },
    caption: {
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
    },
    emptyContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 16,
        fontWeight: '600',
    },
});
