/**
 * Street Burger - Welcome Screen
 */

import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { Typography } from '@/src/constants/typography';
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
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 50,
    },
    emoji: {
        fontSize: 80,
        marginBottom: 16,
    },
    brandName: {
        fontSize: 36,
        fontWeight: '900',
        color: Colors.white,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    insightSection: {
        alignItems: 'center',
        marginBottom: 50,
        paddingHorizontal: 10,
    },
    insightTitle: {
        fontSize: Typography.fontSize.lg,
        color: Colors.white,
        opacity: 0.9,
        marginBottom: 8,
        fontWeight: '600',
    },
    insightHighlight: {
        fontSize: 32,
        fontWeight: '900',
        color: Colors.primary,
        marginBottom: 20,
        textAlign: 'center',
    },
    insightDescription: {
        fontSize: 15,
        color: Colors.white,
        opacity: 0.8,
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '500',
    },
    features: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 60,
        paddingHorizontal: 10,
    },
    featureItem: {
        alignItems: 'center',
        gap: 8,
    },
    featureIcon: {
        fontSize: 32,
    },
    featureText: {
        fontSize: 12,
        color: Colors.white,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    ctaButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 18,
        paddingHorizontal: 60,
        borderRadius: 20,
        marginBottom: 24,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    ctaText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '800',
    },
    skipText: {
        color: Colors.white,
        opacity: 0.6,
        fontSize: 14,
        fontWeight: '700',
    },
});
