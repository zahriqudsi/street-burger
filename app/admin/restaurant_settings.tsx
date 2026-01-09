import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { restaurantService, RestaurantInfo } from '@/src/services/restaurant';
import { BackButton } from '@/components/BackButton';

export default function RestaurantSettings() {
    const [info, setInfo] = useState<RestaurantInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    const handleSave = async () => {
        if (!info) return;
        setSaving(true);
        try {
            await restaurantService.update(info.id, info);
            Alert.alert('Success', 'Restaurant settings updated successfully!');
        } catch (error) {
            console.error('Failed to update restaurant info:', error);
            Alert.alert('Error', 'Failed to update settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: keyof RestaurantInfo, value: any) => {
        if (info) {
            setInfo({ ...info, [field]: value });
        }
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
                title: 'Restaurant Settings',
                headerLeft: () => <BackButton />
            }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>General Info</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Restaurant Name</Text>
                        <TextInput
                            style={styles.input}
                            value={info?.name}
                            onChangeText={(v) => updateField('name', v)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>About Us</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={info?.aboutUs}
                            multiline
                            numberOfLines={4}
                            onChangeText={(v) => updateField('aboutUs', v)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Opening Hours</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={info?.openingHours}
                            multiline
                            numberOfLines={3}
                            onChangeText={(v) => updateField('openingHours', v)}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Contact & Social</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={info?.phone}
                            keyboardType="phone-pad"
                            onChangeText={(v) => updateField('phone', v)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            value={info?.email}
                            keyboardType="email-address"
                            onChangeText={(v) => updateField('email', v)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Facebook URL</Text>
                        <TextInput
                            style={styles.input}
                            value={info?.facebookUrl}
                            onChangeText={(v) => updateField('facebookUrl', v)}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgLight,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bgLight,
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.bgLight,
    },
    sectionLabel: {
        fontSize: Typography.fontSize.md,
        fontWeight: '800',
        color: Colors.primary,
        marginBottom: 24,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '700',
        color: Colors.textMain,
        marginBottom: 10,
        marginLeft: 4,
    },
    input: {
        backgroundColor: Colors.bgLight,
        borderRadius: 16,
        padding: 16,
        fontSize: Typography.fontSize.base,
        color: Colors.textMain,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
        paddingTop: 16,
    },
    saveBtn: {
        backgroundColor: Colors.textMain,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    saveBtnText: {
        color: Colors.white,
        fontSize: Typography.fontSize.lg,
        fontWeight: '800',
    },
});
