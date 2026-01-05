/**
 * Street Burger - Signup Screen
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

export default function SignupScreen() {
    const router = useRouter();
    const { signUp } = useAuth();

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async () => {
        if (!name.trim() || !phoneNumber.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signUp({
                phoneNumber,
                password,
                name,
                email: email.trim() || undefined,
            });

            if (result.success) {
                router.replace('/(tabs)');
            } else {
                Alert.alert('Signup Failed', result.message);
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
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join Street Burger for exclusive rewards</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Name */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Your name"
                            placeholderTextColor={Colors.light.textTertiary}
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                    </View>

                    {/* Phone Number */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone Number *</Text>
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

                    {/* Email (Optional) */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="your@email.com"
                            placeholderTextColor={Colors.light.textTertiary}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password *</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Min. 6 characters"
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

                    {/* Confirm Password */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Re-enter password"
                            placeholderTextColor={Colors.light.textTertiary}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                        />
                    </View>

                    {/* Signup Button */}
                    <TouchableOpacity
                        style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                        onPress={handleSignup}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.signupButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <Link href="/(auth)/login" asChild>
                            <TouchableOpacity>
                                <Text style={styles.loginLink}>Login</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
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
        paddingTop: 40,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    emoji: {
        fontSize: 48,
        marginBottom: 12,
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
        marginBottom: 16,
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
    signupButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: Spacing.borderRadius.lg,
        alignItems: 'center',
        marginTop: 12,
        ...Spacing.shadow.md,
    },
    signupButtonDisabled: {
        opacity: 0.7,
    },
    signupButtonText: {
        ...Typography.styles.button,
        color: '#FFFFFF',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    loginText: {
        ...Typography.styles.body,
        color: Colors.light.textSecondary,
    },
    loginLink: {
        ...Typography.styles.body,
        color: Colors.primary,
        fontWeight: '600',
    },
});
