import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
import { notificationService } from '../../src/services/notifications';

export default function ManageNotifications() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isGlobal, setIsGlobal] = useState(true);
    const [targetUserId, setTargetUserId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!title || !message) {
            Alert.alert('Error', 'Please fill title and message');
            return;
        }

        try {
            setLoading(true);
            await notificationService.create({
                title,
                message,
                isGlobal,
                targetUserId: isGlobal ? undefined : parseInt(targetUserId),
                notificationType: 'GENERAL',
            });

            Alert.alert('Success', 'Notification sent successfully');
            setTitle('');
            setMessage('');
            setTargetUserId('');
        } catch (error) {
            Alert.alert('Error', 'Failed to send notification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Send New Notification</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Notification Title"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Type your message here..."
                        multiline
                        numberOfLines={4}
                        value={message}
                        onChangeText={setMessage}
                    />
                </View>

                <View style={styles.switchRow}>
                    <View>
                        <Text style={styles.label}>Global Notification</Text>
                        <Text style={styles.hint}>Send to everyone</Text>
                    </View>
                    <Switch
                        value={isGlobal}
                        onValueChange={setIsGlobal}
                        trackColor={{ false: '#767577', true: Colors.light.tint + '80' }}
                        thumbColor={isGlobal ? Colors.light.tint : '#f4f3f4'}
                    />
                </View>

                {!isGlobal && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Target User ID</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter User ID"
                            keyboardType="numeric"
                            value={targetUserId}
                            onChangeText={setTargetUserId}
                        />
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.sendButton, loading && styles.disabledButton]}
                    onPress={handleSend}
                    disabled={loading}
                >
                    <Ionicons name="send" size={20} color="#FFF" />
                    <Text style={styles.sendButtonText}>
                        {loading ? 'Sending...' : 'Send Notification'}
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.disclaimer}>
                * High-priority notifications will trigger a push notification if the user has enabled them.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgLight,
    },
    content: {
        padding: 20,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.bgLight,
    },
    cardTitle: {
        fontSize: Typography.fontSize.xl,
        fontWeight: '800',
        marginBottom: 32,
        color: Colors.textMain,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '700',
        color: Colors.textMain,
        marginBottom: 10,
        marginLeft: 4,
    },
    hint: {
        fontSize: 12,
        color: Colors.textMuted,
        marginTop: 2,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 16,
        padding: 16,
        fontSize: Typography.fontSize.base,
        backgroundColor: Colors.bgLight,
        color: Colors.textMain,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
        paddingTop: 16,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.bgLight,
    },
    sendButton: {
        backgroundColor: Colors.textMain,
        padding: 18,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginTop: 12,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    disabledButton: {
        opacity: 0.6,
    },
    sendButtonText: {
        color: Colors.white,
        fontSize: Typography.fontSize.lg,
        fontWeight: '800',
    },
    disclaimer: {
        textAlign: 'center',
        marginTop: 32,
        color: Colors.textMuted,
        fontSize: 12,
        paddingHorizontal: 40,
        fontWeight: '600',
        lineHeight: 18,
    },
});
