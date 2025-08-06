import { router, useLocalSearchParams } from 'expo-router'
import React, { useState, useEffect } from 'react'
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
    Image,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { apiService } from '../src/services/api'
import {
    CLOTHING_CATEGORIES,
    CLOTHING_TAGS,
    CLOTHING_COLORS,
} from '../src/lib/constants'
import * as ImagePicker from 'expo-image-picker'
import { uploadImage } from '../src/services/imageService'

export default function EditItemScreen() {
    const { id } = useLocalSearchParams()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [color, setColor] = useState('')
    const [brand, setBrand] = useState('')
    const [size, setSize] = useState('')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [purchaseDate, setPurchaseDate] = useState('')
    const [imageUri, setImageUri] = useState<string | null>(null)

    useEffect(() => {
        const loadItem = async () => {
            if (!id) return
            setLoading(true)
            try {
                const item = await apiService.getClothingItem(id as string)
                setName(item.name || '')
                setCategory(item.category || '')
                setDescription(item.description || '')
                setColor(item.color || '')
                setBrand(item.brand || '')
                setSize(item.size || '')
                setSelectedTags(item.tags || [])
                setPurchaseDate(item.purchaseDate || '')
                setImageUri(item.imageUrl || null)
            } catch (error) {
                Alert.alert('Error', 'Failed to load item data')
            } finally {
                setLoading(false)
            }
        }
        loadItem()
    }, [id])

    const pickImage = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!permissionResult.granted) {
            Alert.alert(
                'Permission required',
                'Permission to access media library is required!'
            )
            return
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        })
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri)
        }
    }

    const categories = Object.values(CLOTHING_CATEGORIES)
    const availableTags = Object.values(CLOTHING_TAGS)
    const colors = Object.values(CLOTHING_COLORS)

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
            let uploadedImageUrl: string | undefined = undefined
            if (imageUri && !imageUri.startsWith('http')) {
                uploadedImageUrl = await uploadImage(
                    imageUri,
                    `clothes/${Date.now()}.jpg`
                )
            } else if (imageUri) {
                uploadedImageUrl = imageUri
            }
            const itemData = {
                name: name.trim(),
                category: category,
                description: description.trim() || undefined,
                color: color.trim() || undefined,
                brand: brand.trim() || undefined,
                size: size.trim() || undefined,
                tags: selectedTags.length > 0 ? selectedTags : undefined,
                purchaseDate: purchaseDate || undefined,
                imageUrl: uploadedImageUrl,
            }
            await apiService.putClothingItem(id as string, itemData)
            Alert.alert('Success', 'Item updated to your wardrobe!', [
                { text: 'OK', onPress: () => router.push('/wardrobe') },
            ])
        } catch (error) {
            console.error('Error updating item:', error)
            Alert.alert('Error', 'Failed to update item. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <ImageBackground
            source={require('../assets/AddClothPage.jpg')}
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
                    <Text style={styles.title}>Update the Item</Text>
                </View>

                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Image Picker */}
                    <View style={styles.inputGroup}>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={pickImage}
                            disabled={loading}
                        >
                            <Text style={styles.submitButtonText}>
                                {imageUri ? 'Change Image' : 'Pick Image'}
                            </Text>
                        </TouchableOpacity>
                        {imageUri && (
                            <View
                                style={{ alignItems: 'center', marginTop: 10 }}
                            >
                                <Image
                                    source={{ uri: imageUri }}
                                    style={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: 10,
                                        marginBottom: 5,
                                    }}
                                />
                                <Text style={{ color: 'green' }}>
                                    Image selected
                                </Text>
                            </View>
                        )}
                    </View>
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
                        <Text style={styles.label}>Color *</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            <View style={styles.colorContainer}>
                                {colors.map((col) => (
                                    <TouchableOpacity
                                        key={col}
                                        style={[
                                            styles.colorButton,
                                            color === col &&
                                                styles.colorButtonActive,
                                        ]}
                                        onPress={() => setColor(col)}
                                    >
                                        <Text
                                            style={[
                                                styles.colorButtonText,
                                                color === col &&
                                                    styles.colorButtonTextActive,
                                            ]}
                                        >
                                            {col}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
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
                            {loading ? 'Updating Item...' : 'Update Item'}
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
        backgroundColor: '#e5d6b3',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 10,
        marginRight: 0,
    },
    title: {
        // position: 'absolute',
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
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
        backgroundColor: '#816802',
        borderColor: '#816802',
    },
    categoryButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    categoryButtonTextActive: {
        color: 'white',
    },
    colorContainer: {
        flexDirection: 'row',
        paddingVertical: 5,
    },
    colorButton: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    colorButtonActive: {
        backgroundColor: '#816802',
        borderColor: '#816802',
    },
    colorButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    colorButtonTextActive: {
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
