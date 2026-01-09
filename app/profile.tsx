import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { BackButton } from '@/components/BackButton';
import { useAuth } from '@/src/contexts/AuthContext';
import { userService } from '@/src/services/users';

export default function ProfileScreen() {
    const { user, updateUser } = useAuth();
    const router = useRouter();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        setIsSaving(true);
        try {
            const updatedUser = await userService.updateProfile({ name, email });
            updateUser(updatedUser);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.error('Failed to update profile:', error);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                headerShown: true,
                title: 'Account Settings',
                headerTransparent: true,
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: 'bold' },
                headerLeft: () => <BackButton color={Colors.white} />
            }} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header Background */}
                    <View style={styles.headerBg}>
                        <View style={styles.profileHeader}>
                            <View style={styles.avatarContainer}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{user?.name?.[0].toUpperCase() || 'U'}</Text>
                                </View>
                                <TouchableOpacity style={styles.editAvatarBtn}>
                                    <Ionicons name="camera" size={18} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.userName}>{user?.name}</Text>
                            <Text style={styles.userRole}>{user?.role} ACCOUNT</Text>
                        </View>
                    </View>

                    {/* Quick Access */}
                    <View style={styles.quickAccess}>
                        <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(tabs)/order')}>
                            <View style={[styles.quickIcon, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="receipt" size={24} color={Colors.primary} />
                            </View>
                            <Text style={styles.quickText}>My Orders</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/cart')}>
                            <View style={[styles.quickIcon, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="cart" size={24} color="#2E7D32" />
                            </View>
                            <Text style={styles.quickText}>My Basket</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="person-outline" size={20} color="#CBD5E0" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter your name"
                                    placeholderTextColor="#A0AEC0"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={20} color="#CBD5E0" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#A0AEC0"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={[styles.inputWrapper, styles.disabledInput]}>
                                <Ionicons name="call-outline" size={20} color="#CBD5E0" style={styles.inputIcon} />
                                <Text style={styles.disabledText}>{user?.phoneNumber}</Text>
                                <Ionicons name="lock-closed" size={14} color="#CBD5E0" />
                            </View>
                            <Text style={styles.helperText}>Phone number cannot be changed.</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.saveBtn, isSaving && styles.disabledBtn]}
                            onPress={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <>
                                    <Text style={styles.saveBtnText}>Save Changes</Text>
                                    <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.backBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgLight,
    },
    scrollContent: {
        flexGrow: 1,
    },
    headerBg: {
        backgroundColor: Colors.primary,
        paddingTop: 100,
        paddingBottom: 40,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    profileHeader: {
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 4,
        borderColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: Colors.white,
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.secondary,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    userName: {
        fontSize: Typography.fontSize['3xl'],
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 4,
    },
    userRole: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    formContainer: {
        padding: 24,
        marginTop: -20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '700',
        color: Colors.textMain,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: Typography.fontSize.base,
        color: Colors.textMain,
        height: '100%',
    },
    disabledInput: {
        backgroundColor: Colors.bgLight,
        borderColor: Colors.border,
    },
    disabledText: {
        flex: 1,
        fontSize: Typography.fontSize.base,
        color: Colors.textMuted,
    },
    helperText: {
        fontSize: 12,
        color: Colors.textMuted,
        marginTop: 6,
        marginLeft: 4,
    },
    saveBtn: {
        backgroundColor: Colors.primary,
        height: 60,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    saveBtnText: {
        color: Colors.white,
        fontSize: Typography.fontSize.lg,
        fontWeight: 'bold',
        marginRight: 8,
    },
    disabledBtn: {
        opacity: 0.7,
    },
    backBtn: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    backBtnText: {
        color: Colors.textMuted,
        fontSize: Typography.fontSize.base,
        fontWeight: '600',
    },
    quickAccess: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginTop: 20,
        gap: 16,
    },
    quickBtn: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.bgLight,
    },
    quickIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    quickText: {
        fontWeight: 'bold',
        color: Colors.textMain,
        fontSize: 14,
    },
});
