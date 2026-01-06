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
    section: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#718096',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F7FAFC',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#2D3748',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveBtn: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    saveBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
