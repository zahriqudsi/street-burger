import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { chefService } from '../src/services';
import { Chef } from '../src/types';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Stack } from 'expo-router';
import { BackButton } from '@/components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChefsScreen() {
    const [chefs, setChefs] = useState<Chef[]>([]);
    const [loading, setLoading] = useState(true);

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
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                title: 'Meet Our Chefs',
                headerTransparent: true,
                headerTintColor: '#FFF',
                headerLeft: () => <BackButton light={true} />
            }} />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1577214224216-7561146a5201?q=80&w=2070' }}
                        style={styles.heroImage}
                    />
                    <View style={styles.heroOverlay}>
                        <Text style={styles.heroTitle}>Our Culinary Masters</Text>
                        <Text style={styles.heroSubtitle}>Dedicated to Perfection in Every Bite</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    {chefs.length > 0 ? (
                        chefs.map((chef) => (
                            <View key={chef.id} style={styles.chefCard}>
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={{ uri: chef.imageUrl?.startsWith('http') ? chef.imageUrl : `http://192.168.99.121:8080/images/${chef.imageUrl}` }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View style={styles.chefInfo}>
                                    <Text style={styles.chefName}>{chef.name}</Text>
                                    <Text style={styles.chefTitle}>{chef.title}</Text>
                                    {chef.bio && <Text style={styles.chefBio}>{chef.bio}</Text>}
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="people-outline" size={64} color="#CBD5E0" />
                            <Text style={styles.emptyText}>No chefs profiles available yet.</Text>
                        </View>
                    )}
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
    chefCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 24,
        ...Spacing.shadow.md,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    imageContainer: { width: '100%', height: 260 },
    image: { width: '100%', height: '100%' },
    chefInfo: { padding: 20 },
    chefName: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    chefTitle: { fontSize: 16, fontWeight: '600', color: Colors.primary, marginBottom: 12 },
    chefBio: { fontSize: 15, color: '#666', lineHeight: 22 },
    emptyContainer: { alignItems: 'center', marginTop: 60 },
    emptyText: { color: '#999', fontSize: 16, marginTop: 12 }
});
