import { router } from 'expo-router'
import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    ImageBackground,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { apiService } from '../src/services/api'
import { CLOTHING_CATEGORIES, CLOTHING_TAGS } from '../src/lib/constants'

export default function AddClothScreen() {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [color, setColor] = useState('')
    const [brand, setBrand] = useState('')
    const [size, setSize] = useState('')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [purchaseDate, setPurchaseDate] = useState('')

    const categories = Object.values(CLOTHING_CATEGORIES)
    const availableTags = Object.values(CLOTHING_TAGS)

    const handleSubmit = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter an item name')
            return
        }

        if (!category) {
            Alert.alert('Error', 'Please select a category')
            return
        }

        setLoading(true)

        try {
            const itemData = {
                name: name.trim(),
                category: category,
                description: description.trim() || undefined,
                color: color.trim() || undefined,
                brand: brand.trim() || undefined,
                size: size.trim() || undefined,
                tags: selectedTags.length > 0 ? selectedTags : undefined,
                purchaseDate: purchaseDate || undefined,
            }

            await apiService.addClothingItem(itemData)
            Alert.alert('Success', 'Item added to your wardrobe!', [
                { text: 'OK', onPress: () => router.push('/wardrobe') },
            ])
        } catch (error) {
            console.error('Error adding item:', error)
            Alert.alert('Error', 'Failed to add item. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <ImageBackground
            source={require('../assets/ItemPage.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Add New Item</Text>
                </View>

                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name *</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g., Graphic T-Shirt"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Category */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Category *</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            <View style={styles.categoryContainer}>
                                {categories.map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        style={[
                                            styles.categoryButton,
                                            category === cat &&
                                                styles.categoryButtonActive,
                                        ]}
                                        onPress={() => setCategory(cat)}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryButtonText,
                                                category === cat &&
                                                    styles.categoryButtonTextActive,
                                            ]}
                                        >
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Color */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Color</Text>
                        <TextInput
                            style={styles.input}
                            value={color}
                            onChangeText={setColor}
                            placeholder="e.g., White"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Brand */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Brand</Text>
                        <TextInput
                            style={styles.input}
                            value={brand}
                            onChangeText={setBrand}
                            placeholder="e.g., Zara"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Description */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Brief description of the item..."
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* Size */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Size</Text>
                        <TextInput
                            style={styles.input}
                            value={size}
                            onChangeText={setSize}
                            placeholder="e.g., S, M, L"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Tags */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tags</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            <View style={styles.tagsContainer}>
                                {availableTags.map((tag) => (
                                    <TouchableOpacity
                                        key={tag}
                                        style={[
                                            styles.tagButton,
                                            selectedTags.includes(tag) &&
                                                styles.tagButtonActive,
                                        ]}
                                        onPress={() => {
                                            if (selectedTags.includes(tag)) {
                                                setSelectedTags(
                                                    selectedTags.filter(
                                                        (t) => t !== tag
                                                    )
                                                )
                                            } else {
                                                setSelectedTags([
                                                    ...selectedTags,
                                                    tag,
                                                ])
                                            }
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.tagButtonText,
                                                selectedTags.includes(tag) &&
                                                    styles.tagButtonTextActive,
                                            ]}
                                        >
                                            {tag}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Purchase Date */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Purchase Date</Text>
                        <TextInput
                            style={styles.input}
                            value={purchaseDate}
                            onChangeText={setPurchaseDate}
                            placeholder="YYYY-MM-DD (e.g., 2024-01-15)"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            loading && styles.submitButtonDisabled,
                        ]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.submitButtonText}>
                            {loading ? 'Adding Item...' : 'Add To My Wardrobe'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    backgroundImage: {
        flex: 1,
    },
    header: {
        padding: 20,
        backgroundColor: '#c19a6b',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 10,
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 50,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    categoryContainer: {
        flexDirection: 'row',
        paddingVertical: 5,
    },
    categoryButton: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    categoryButtonActive: {
        backgroundColor: 'brown',
        borderColor: 'brown',
    },
    categoryButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    categoryButtonTextActive: {
        color: 'white',
    },
    tagsContainer: {
        flexDirection: 'row',
        paddingVertical: 5,
    },
    tagButton: {
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 15,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    tagButtonActive: {
        backgroundColor: '#816802',
        borderColor: '#816802',
    },
    tagButtonText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    tagButtonTextActive: {
        color: 'white',
    },
    submitButton: {
        backgroundColor: '#c19a6b',
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonDisabled: {
        backgroundColor: '#999',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '500',
    },
})
