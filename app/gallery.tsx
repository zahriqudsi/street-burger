import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { galleryService } from '../src/services';
import { GalleryImage } from '../src/types';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Stack } from 'expo-router';
import { BackButton } from '@/components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48 - 12) / 2;

export default function GalleryScreen() {
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
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                title: 'Our Gallery',
                headerTransparent: true,
                headerTintColor: '#FFF',
                headerLeft: () => <BackButton light={true} />
            }} />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070' }}
                        style={styles.heroImage}
                    />
                    <View style={styles.heroOverlay}>
                        <Text style={styles.heroTitle}>Savor the Moments</Text>
                        <Text style={styles.heroSubtitle}>A Visual Journey Through Our Kitchen</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <View style={styles.grid}>
                        {images.length > 0 ? (
                            images.map((img) => (
                                <View key={img.id} style={styles.imageCard}>
                                    <Image
                                        source={{ uri: img.imageUrl.startsWith('http') ? img.imageUrl : `http://192.168.99.121:8080/images/${img.imageUrl}` }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                    {img.caption && (
                                        <View style={styles.captionContainer}>
                                            <Text style={styles.caption} numberOfLines={1}>{img.caption}</Text>
                                        </View>
                                    )}
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="images-outline" size={64} color="#CBD5E0" />
                                <Text style={styles.emptyText}>No images in gallery yet.</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    heroContainer: { height: 350, width: '100%' },
    heroImage: { width: '100%', height: '100%' },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
        padding: 24,
    },
    heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
    heroSubtitle: { fontSize: 16, color: '#E2E8F0', fontWeight: '500' },
    content: { padding: 24 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    imageCard: {
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH * 1.2,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F7FAFC',
        ...Spacing.shadow.sm,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    image: { width: '100%', height: '100%' },
    captionContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8
    },
    caption: { color: '#FFF', fontSize: 12, fontWeight: '600' },
    emptyContainer: { width: '100%', alignItems: 'center', marginTop: 60 },
    emptyText: { color: '#999', fontSize: 16, marginTop: 12 }
});
