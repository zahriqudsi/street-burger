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
import { Colors } from '@/src/constants/colors';
import { restaurantService, RestaurantInfo } from '@/src/services/restaurant';
import { BackButton } from '@/components/BackButton';

export default function LocationScreen() {
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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                title: 'Our Location',
                headerLeft: () => <BackButton />
            }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="location" size={32} color="#FFF" />
                    </View>

                    <Text style={styles.title}>Visit Us</Text>
                    <Text style={styles.address}>{info?.address || 'Loading address...'}</Text>

                    <TouchableOpacity style={styles.mapsButton} onPress={openMaps}>
                        <Ionicons name="navigate" size={20} color="#FFF" />
                        <Text style={styles.mapsButtonText}>Get Directions</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.card, { marginTop: 20 }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="time-outline" size={24} color={Colors.primary} />
                        <Text style={styles.sectionTitle}>Opening Hours</Text>
                    </View>

                    <View style={styles.hoursContainer}>
                        {info?.openingHours.split('\n').map((line, index) => (
                            <View key={index} style={styles.hourRow}>
                                <Text style={styles.hourText}>{line}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <Ionicons name="information-circle" size={24} color={Colors.primary} />
                    <Text style={styles.infoText}>
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
        backgroundColor: '#F7FAFC',
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
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 12,
    },
    address: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    mapsButton: {
        backgroundColor: '#2D3748',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 16,
    },
    mapsButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A202C',
        marginLeft: 12,
    },
    hoursContainer: {
        width: '100%',
    },
    hourRow: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EDF2F7',
    },
    hourText: {
        fontSize: 15,
        color: '#4A5568',
        fontWeight: '500',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary + '10',
        borderRadius: 16,
        padding: 16,
        marginTop: 30,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#2D3748',
        marginLeft: 12,
        lineHeight: 20,
    },
});
