import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
import { Spacing } from '../../src/constants/spacing';
import { menuService } from '../../src/services/menu';
import { MenuCategory, MenuItem } from '../../src/types';

export default function ManageMenu() {
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'category' | 'item'>('category');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [cats, allItems] = await Promise.all([
                menuService.getCategories(),
                menuService.getAllItems(),
            ]);
            setCategories(cats);
            setItems(allItems);
        } catch (error) {
            console.error('Error loading menu data:', error);
            Alert.alert('Error', 'Failed to load menu data');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (modalType === 'category') {
                if (editingId) {
                    await menuService.updateCategory(editingId, formData);
                } else {
                    await menuService.addCategory(formData);
                }
            } else {
                if (editingId) {
                    await menuService.updateItem(editingId, formData);
                } else {
                    await menuService.addItem(formData);
                }
            }
            setModalVisible(false);
            loadData();
            Alert.alert('Success', 'Menu data saved');
        } catch (error) {
            Alert.alert('Error', 'Failed to save');
        }
    };

    const handleDelete = (type: 'category' | 'item', id: number) => {
        Alert.alert(
            'Confirm Delete',
            `Are you sure you want to delete this ${type}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (type === 'category') await menuService.deleteCategory(id);
                            else await menuService.deleteItem(id);
                            loadData();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete');
                        }
                    }
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.light.tint} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                            setModalType('category');
                            setEditingId(null);
                            setFormData({ name: '', icon: '' });
                            setModalVisible(true);
                        }}
                    >
                        <Ionicons name="add" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {categories.map(cat => (
                    <View key={cat.id} style={styles.listItem}>
                        <Text style={styles.listText}>{cat.name}</Text>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => {
                                setModalType('category');
                                setEditingId(cat.id);
                                setFormData(cat);
                                setModalVisible(true);
                            }}>
                                <Ionicons name="pencil" size={20} color={Colors.light.tint} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete('category', cat.id)}>
                                <Ionicons name="trash" size={20} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Menu Items</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                            setModalType('item');
                            setEditingId(null);
                            setFormData({ title: '', description: '', price: 0, categoryId: categories[0]?.id });
                            setModalVisible(true);
                        }}
                    >
                        <Ionicons name="add" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {items.map(item => (
                    <View key={item.id} style={styles.listItem}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.listText}>{item.title}</Text>
                            <Text style={styles.listSubtext}>LKR {item.price}</Text>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => {
                                setModalType('item');
                                setEditingId(item.id);
                                setFormData(item);
                                setModalVisible(true);
                            }}>
                                <Ionicons name="pencil" size={20} color={Colors.light.tint} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete('item', item.id)}>
                                <Ionicons name="trash" size={20} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editingId ? 'Edit' : 'Add'} {modalType === 'category' ? 'Category' : 'Item'}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={modalType === 'category' ? formData.name : formData.title}
                            onChangeText={text => setFormData(modalType === 'category' ? { ...formData, name: text } : { ...formData, title: text })}
                        />

                        {modalType === 'category' && (
                            <TextInput
                                style={styles.input}
                                placeholder="Icon URL or Emoji"
                                value={formData.icon}
                                onChangeText={text => setFormData({ ...formData, icon: text })}
                            />
                        )}

                        {modalType === 'item' && (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Price"
                                    keyboardType="numeric"
                                    value={formData.price?.toString()}
                                    onChangeText={text => setFormData({ ...formData, price: parseFloat(text) })}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Description"
                                    multiline
                                    value={formData.description}
                                    onChangeText={text => setFormData({ ...formData, description: text })}
                                />
                            </>
                        )}

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={handleSave}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    section: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold' },
    addButton: { backgroundColor: Colors.light.tint, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    listText: { fontSize: 16, fontWeight: '500' },
    listSubtext: { fontSize: 12, color: '#666' },
    actions: { flexDirection: 'row', gap: 16 },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 24 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, marginBottom: 16 },
    modalActions: { flexDirection: 'row', gap: 12 },
    button: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center' },
    cancelButton: { backgroundColor: '#999' },
    saveButton: { backgroundColor: Colors.light.tint },
    buttonText: { color: '#FFF', fontWeight: 'bold' },
});
