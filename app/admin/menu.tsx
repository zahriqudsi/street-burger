import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
import { Spacing } from '../../src/constants/spacing';
import { menuService } from '../../src/services/menu';
import { MenuCategory, MenuItem } from '../../src/types';
import { formatLKR } from '../../src/utils/format';
import { Stack } from 'expo-router';
import { BackButton } from '@/components/BackButton';

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
                // Ensure category is properly structured for backend
                const payload = {
                    ...formData,
                    category: formData.categoryId ? { id: formData.categoryId } : null
                };

                if (editingId) {
                    await menuService.updateItem(editingId, payload);
                } else {
                    await menuService.addItem(payload);
                }
            }
            setModalVisible(false);
            loadData();
            Alert.alert('Success', 'Menu data saved');
        } catch (error) {
            console.error('Save error:', error);
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
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                title: 'Manage Menu',
                headerLeft: () => <BackButton />
            }} />
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
                            <View style={styles.listImageContainer}>
                                {item.imageUrl ? (
                                    <Image
                                        source={{ uri: item.imageUrl.startsWith('http') ? item.imageUrl : `file://${item.imageUrl}` }}
                                        style={styles.listImage}
                                    />
                                ) : (
                                    <View style={styles.listImagePlaceholder}>
                                        <Ionicons name="fast-food" size={20} color="#999" />
                                    </View>
                                )}
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.listText}>{item.title}</Text>
                                <Text style={styles.listSubtext}>
                                    {item.category?.name || 'No Category'} • {formatLKR(item.price)}
                                </Text>
                            </View>
                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => {
                                    setModalType('item');
                                    setEditingId(item.id);
                                    setFormData({
                                        ...item,
                                        categoryId: item.category?.id
                                    });
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
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalBg}
                    >
                        <View style={styles.modalContent}>
                            <ScrollView bounces={false}>
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
                                            value={formData.price !== undefined && formData.price !== null && !isNaN(formData.price) ? formData.price.toString() : ''}
                                            onChangeText={text => {
                                                const parsed = parseFloat(text);
                                                setFormData({ ...formData, price: isNaN(parsed) ? 0 : parsed });
                                            }}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Description"
                                            multiline
                                            numberOfLines={3}
                                            value={formData.description}
                                            onChangeText={text => setFormData({ ...formData, description: text })}
                                        />

                                        <Text style={styles.label}>Select Category</Text>
                                        <View style={styles.categoryPickerContainer}>
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryPicker}>
                                                {categories.length === 0 ? (
                                                    <Text style={styles.noCategories}>No categories found</Text>
                                                ) : (
                                                    categories.map(cat => (
                                                        <TouchableOpacity
                                                            key={cat.id}
                                                            style={[
                                                                styles.categoryChip,
                                                                formData.categoryId === cat.id && styles.categoryChipActive
                                                            ]}
                                                            onPress={() => setFormData({ ...formData, categoryId: cat.id })}
                                                        >
                                                            <Text style={[
                                                                styles.categoryChipText,
                                                                formData.categoryId === cat.id && styles.categoryChipTextActive
                                                            ]}>
                                                                {cat.name}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))
                                                )}
                                            </ScrollView>
                                        </View>
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
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgLight,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        margin: 16,
        padding: 20,
        backgroundColor: Colors.white,
        borderRadius: 24,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.bgLight,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.xl,
        fontWeight: 'bold',
        color: Colors.textMain,
    },
    addButton: {
        backgroundColor: Colors.secondary,
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.bgLight,
    },
    listImageContainer: {
        width: 52,
        height: 52,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: 16,
        backgroundColor: Colors.bgLight,
    },
    listImage: {
        width: '100%',
        height: '100%',
    },
    listImagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listText: {
        fontSize: Typography.fontSize.md,
        fontWeight: '700',
        color: Colors.textMain,
        marginBottom: 2,
    },
    listSubtext: {
        fontSize: Typography.fontSize.sm,
        color: Colors.textMuted,
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'row',
        gap: 16,
        paddingLeft: 10,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: Colors.bgLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderRadius: 32,
        padding: 24,
        width: '100%',
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: Typography.fontSize['2xl'],
        fontWeight: '800',
        color: Colors.textMain,
        marginBottom: 24,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '700',
        color: Colors.textMain,
        marginBottom: 8,
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
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.bgLight,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    saveButton: {
        backgroundColor: Colors.secondary,
    },
    buttonText: {
        fontSize: Typography.fontSize.base,
        fontWeight: '700',
        color: Colors.white,
    },
    cancelButtonText: {
        color: Colors.textMuted,
    },
    label: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '700',
        color: Colors.textMain,
        marginBottom: 12,
        marginTop: 8,
        marginLeft: 4,
    },
    categoryPickerContainer: {
        marginBottom: 16,
    },
    categoryPicker: {
        flexDirection: 'row',
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: Colors.bgLight,
        marginRight: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    categoryChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    categoryChipText: {
        fontSize: Typography.fontSize.sm,
        color: Colors.textMuted,
        fontWeight: '600',
    },
    categoryChipTextActive: {
        color: Colors.white,
        fontWeight: '700',
    },
    noCategories: {
        color: Colors.error,
        fontStyle: 'italic',
        paddingVertical: 8,
    },
});
