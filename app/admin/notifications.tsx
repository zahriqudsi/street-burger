import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
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
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    content: { padding: 16 },
    card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 24, color: '#333' },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', color: '#444', marginBottom: 8 },
    hint: { fontSize: 12, color: '#999', marginTop: -4, marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 12, fontSize: 16, backgroundColor: '#FAFAFA' },
    textArea: { height: 100, textAlignVertical: 'top' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    sendButton: { backgroundColor: Colors.light.tint, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 },
    disabledButton: { opacity: 0.6 },
    sendButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    disclaimer: { textAlign: 'center', marginTop: 24, color: '#999', fontSize: 12, paddingHorizontal: 40 },
});
