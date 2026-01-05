/**
 * Street Burger - Login Screen
 */

import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { Typography } from '@/src/constants/typography';
import { useAuth } from '@/src/contexts/AuthContext';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const { signIn } = useAuth();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!phoneNumber.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter your phone number and password');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn(phoneNumber.trim(), password.trim());
            if (result.success) {
                router.replace('/(tabs)');
            } else {
                Alert.alert('Login Failed', result.message);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.emoji}>🍔</Text>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Login to your Street Burger account</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Phone Number */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+94 77 123 4567"
                            placeholderTextColor={Colors.light.textTertiary}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Enter your password"
                                placeholderTextColor={Colors.light.textTertiary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.loginButtonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    {/* Signup Link */}
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <Link href="/(auth)/signup" asChild>
                            <TouchableOpacity>
                                <Text style={styles.signupLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    {/* Continue as Guest */}
                    <TouchableOpacity
                        style={styles.guestButton}
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <Text style={styles.guestButtonText}>Continue as Guest</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: Spacing.screenPaddingLarge,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    emoji: {
        fontSize: 56,
        marginBottom: 16,
    },
    title: {
        ...Typography.styles.h2,
        color: Colors.light.text,
        marginBottom: 8,
    },
    subtitle: {
        ...Typography.styles.body,
        color: Colors.light.textSecondary,
        textAlign: 'center',
    },
    form: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        ...Typography.styles.label,
        color: Colors.light.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.light.surface,
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: Spacing.borderRadius.lg,
        paddingHorizontal: Spacing.inputPadding,
        paddingVertical: 14,
        fontSize: 16,
        color: Colors.light.text,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.surface,
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: Spacing.borderRadius.lg,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: Spacing.inputPadding,
        paddingVertical: 14,
        fontSize: 16,
        color: Colors.light.text,
    },
    eyeButton: {
        paddingHorizontal: 12,
    },
    eyeIcon: {
        fontSize: 20,
    },
    loginButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: Spacing.borderRadius.lg,
        alignItems: 'center',
        marginTop: 12,
        ...Spacing.shadow.md,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        ...Typography.styles.button,
        color: '#FFFFFF',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    signupText: {
        ...Typography.styles.body,
        color: Colors.light.textSecondary,
    },
    signupLink: {
        ...Typography.styles.body,
        color: Colors.primary,
        fontWeight: '600',
    },
    guestButton: {
        marginTop: 24,
        paddingVertical: 12,
        alignItems: 'center',
    },
    guestButtonText: {
        ...Typography.styles.body,
        color: Colors.light.textSecondary,
        textDecorationLine: 'underline',
    },
});
