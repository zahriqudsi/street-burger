/**
 * Street Burger - App Entry / Splash Screen
 */

import { Colors } from '@/src/constants/colors';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, BackHandler } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const bgAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        // Animate logo fade in and scale
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 20,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Animate background from black to light after 1.5s
        setTimeout(() => {
            Animated.timing(bgAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: false,
            }).start();
        }, 1500);

        // Navigate to welcome screen after 3s
        const timer = setTimeout(() => {
            router.replace('/welcome');
        }, 3000);

        return () => {
            clearTimeout(timer);
            backHandler.remove();
        };
    }, []);

    const backgroundColor = bgAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#000000', '#FFFFFF'],
    });

    const textColor = bgAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#FFFFFF', '#000000'],
    });

    const primaryColor = bgAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#FFFFFF', Colors.primary],
    });

    return (
        <Animated.View style={[styles.container, { backgroundColor }]}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {/* Logo Text */}
                <Animated.Text style={[styles.logoText]}>
                    🍔
                </Animated.Text>
                <Animated.Text style={[styles.brandName, { color: textColor }]}>
                    Street Burger
                </Animated.Text>
                <Animated.Text style={[styles.tagline, { color: primaryColor }]}>
                    Sri Lankan Seafood Flavors
                </Animated.Text>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoText: {
        fontSize: 80,
        marginBottom: 16,
    },
    brandName: {
        fontSize: 36,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        fontWeight: '400',
        opacity: 0.9,
        letterSpacing: 1,
    },
});
