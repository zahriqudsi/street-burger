/**
 * Street Burger - Welcome Screen
 */

import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, BackHandler } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();

    useEffect(() => {
        const backAction = () => {
            // Exit app instead of going back to splash
            BackHandler.exitApp();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);

    const handleGetStarted = () => {
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            {/* Background with overlay */}
            <View style={styles.backgroundContainer}>
                <View style={styles.overlay} />

                {/* Content */}
                <View style={styles.content}>
                    {/* Logo Section */}
                    <View style={styles.logoSection}>
                        <Text style={styles.emoji}>🍔</Text>
                        <Text style={styles.brandName}>Street Burger</Text>
                    </View>

                    {/* Sri Lankan Insight */}
                    <View style={styles.insightSection}>
                        <Text style={styles.insightTitle}>Discover Sri Lanka's</Text>
                        <Text style={styles.insightHighlight}>Coastal Flavors</Text>
                        <Text style={styles.insightDescription}>
                            Sri Lanka's coastal heritage meets gourmet craftsmanship. Our burgers feature island-sourced seafood and authentic 'devilled' spices for an experience found nowhere else in the world.
                        </Text>
                    </View>

                    {/* Features */}
                    <View style={styles.features}>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🦐</Text>
                            <Text style={styles.featureText}>Fresh Seafood</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🌶️</Text>
                            <Text style={styles.featureText}>Lankan Spices</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>👨‍🍳</Text>
                            <Text style={styles.featureText}>Expert Chefs</Text>
                        </View>
                    </View>

                    {/* CTA Button */}
                    <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
                        <Text style={styles.ctaText}>Get Started</Text>
                    </TouchableOpacity>

                    {/* Skip Text */}
                    <TouchableOpacity onPress={handleGetStarted}>
                        <Text style={styles.skipText}>Explore our menu →</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.secondary,
    },
    backgroundContainer: {
        flex: 1,
        backgroundColor: Colors.secondary,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(44, 62, 80, 0.85)',
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.screenPaddingLarge,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    emoji: {
        fontSize: 64,
        marginBottom: 12,
    },
    brandName: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    insightSection: {
        alignItems: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    insightTitle: {
        fontSize: 18,
        color: '#FFFFFF',
        opacity: 0.8,
        marginBottom: 4,
    },
    insightHighlight: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 16,
    },
    insightDescription: {
        fontSize: 15,
        color: '#FFFFFF',
        opacity: 0.85,
        textAlign: 'center',
        lineHeight: 24,
    },
    features: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 48,
    },
    featureItem: {
        alignItems: 'center',
    },
    featureIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    featureText: {
        fontSize: 12,
        color: '#FFFFFF',
        opacity: 0.9,
        fontWeight: '500',
    },
    ctaButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: Spacing.borderRadius.xl,
        marginBottom: 20,
        ...Spacing.shadow.lg,
    },
    ctaText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    skipText: {
        color: '#FFFFFF',
        opacity: 0.7,
        fontSize: 14,
    },
});
