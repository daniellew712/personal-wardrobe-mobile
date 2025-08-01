import { router } from 'expo-router'
import React, { useEffect, useState, useMemo } from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    Alert,
    ScrollView,
    ImageBackground,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { apiService } from '../src/services/api'

export default function WardrobeScreen() {
    const [clothes, setClothes] = useState([])
    const [loading, setLoading] = useState(true)

    // Sort and Filter states
    const [sortBy, setSortBy] = useState('name')
    const [filterBy, setFilterBy] = useState({
        category: '',
        color: '',
        brand: '',
        tags: '',
    })
    const [showSortMenu, setShowSortMenu] = useState(false)
    const [showFilterMenu, setShowFilterMenu] = useState(false)

    useEffect(() => {
        loadClothes()
    }, [])

    const loadClothes = async () => {
        try {
            const data = await apiService.getClothes()
            setClothes(data)
        } catch (error) {
            console.error('Error:', error)
            Alert.alert('Error', 'Could not load clothes')
        } finally {
            setLoading(false)
        }
    }

    // Filter and sort clothes
    const filteredAndSortedClothes = useMemo(() => {
        let filtered = clothes.filter((item: any) => {
            if (filterBy.category && item.category !== filterBy.category)
                return false
            if (filterBy.color && item.color !== filterBy.color) return false
            if (filterBy.brand && item.brand !== filterBy.brand) return false
            if (filterBy.tags && !item.tags?.includes(filterBy.tags))
                return false
            return true
        })

        // Sort the filtered results
        filtered.sort((a: any, b: any) => {
            switch (sortBy) {
                case 'purchaseDate':
                    return (
                        new Date(b.purchaseDate || 0).getTime() -
                        new Date(a.purchaseDate || 0).getTime()
                    )
                case 'size':
                    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
                    const aIndex = sizeOrder.indexOf(a.size || '')
                    const bIndex = sizeOrder.indexOf(b.size || '')
                    return (
                        (aIndex === -1 ? 999 : aIndex) -
                        (bIndex === -1 ? 999 : bIndex)
                    )
                default: // name
                    return (a.name || '').localeCompare(b.name || '')
            }
        })

        return filtered
    }, [clothes, filterBy, sortBy])

    // Get unique values for filter options
    const filterOptions = useMemo(() => {
        const categories = [
            ...new Set(
                clothes.map((item: any) => item.category).filter(Boolean)
            ),
        ]
        const colors = [
            ...new Set(clothes.map((item: any) => item.color).filter(Boolean)),
        ]
        const brands = [
            ...new Set(clothes.map((item: any) => item.brand).filter(Boolean)),
        ]
        const allTags = clothes.flatMap((item: any) => item.tags || [])
        const tags = [...new Set(allTags)]

        return { categories, colors, brands, tags }
    }, [clothes])
    return (
        <ImageBackground
            source={require('../assets/wardrobePage.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.goback}
                        onPress={() => router.push('/home')}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.title}>My Wardrobe</Text>
                    <Text style={styles.subtitle}>
                        Manage your clothing items
                    </Text>
                </View>

                <View style={styles.content}>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/addCloth')}
                    >
                        <Text style={styles.addButtonText}>+ Add New Item</Text>
                    </TouchableOpacity>

                    {/* Sort and Filter Controls */}
                    <View style={styles.controlsContainer}>
                        <TouchableOpacity
                            style={styles.controlButton}
                            onPress={() => setShowSortMenu(!showSortMenu)}
                        >
                            <Ionicons
                                name="funnel-outline"
                                size={16}
                                color="#c19a6b"
                            />
                            <Text style={styles.controlButtonText}>Sort</Text>
                            <Ionicons
                                name={
                                    showSortMenu ? 'chevron-up' : 'chevron-down'
                                }
                                size={16}
                                color="#c19a6b"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.controlButton}
                            onPress={() => setShowFilterMenu(!showFilterMenu)}
                        >
                            <Ionicons
                                name="options-outline"
                                size={16}
                                color="#c19a6b"
                            />
                            <Text style={styles.controlButtonText}>Filter</Text>
                            <Ionicons
                                name={
                                    showFilterMenu
                                        ? 'chevron-up'
                                        : 'chevron-down'
                                }
                                size={16}
                                color="#c19a6b"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Sort Menu */}
                    {showSortMenu && (
                        <View style={styles.menuContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.menuItem,
                                    sortBy === 'name' && styles.activeMenuItem,
                                ]}
                                onPress={() => {
                                    setSortBy('name')
                                    setShowSortMenu(false)
                                }}
                            >
                                <Text
                                    style={[
                                        styles.menuItemText,
                                        sortBy === 'name' &&
                                            styles.activeMenuItemText,
                                    ]}
                                >
                                    Name
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.menuItem,
                                    sortBy === 'purchaseDate' &&
                                        styles.activeMenuItem,
                                ]}
                                onPress={() => {
                                    setSortBy('purchaseDate')
                                    setShowSortMenu(false)
                                }}
                            >
                                <Text
                                    style={[
                                        styles.menuItemText,
                                        sortBy === 'purchaseDate' &&
                                            styles.activeMenuItemText,
                                    ]}
                                >
                                    Purchase Date
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.menuItem,
                                    sortBy === 'size' && styles.activeMenuItem,
                                ]}
                                onPress={() => {
                                    setSortBy('size')
                                    setShowSortMenu(false)
                                }}
                            >
                                <Text
                                    style={[
                                        styles.menuItemText,
                                        sortBy === 'size' &&
                                            styles.activeMenuItemText,
                                    ]}
                                >
                                    Size
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Filter Menu */}
                    {showFilterMenu && (
                        <View style={styles.menuContainer}>
                            <ScrollView style={styles.filterScrollView}>
                                {/* Category Filter */}
                                <Text style={styles.filterSectionTitle}>
                                    Category
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styles.menuItem,
                                        !filterBy.category &&
                                            styles.activeMenuItem,
                                    ]}
                                    onPress={() =>
                                        setFilterBy((prev) => ({
                                            ...prev,
                                            category: '',
                                        }))
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.menuItemText,
                                            !filterBy.category &&
                                                styles.activeMenuItemText,
                                        ]}
                                    >
                                        All Categories
                                    </Text>
                                </TouchableOpacity>
                                {filterOptions.categories.map((category) => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            styles.menuItem,
                                            filterBy.category === category &&
                                                styles.activeMenuItem,
                                        ]}
                                        onPress={() =>
                                            setFilterBy((prev) => ({
                                                ...prev,
                                                category,
                                            }))
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.menuItemText,
                                                filterBy.category ===
                                                    category &&
                                                    styles.activeMenuItemText,
                                            ]}
                                        >
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                ))}

                                {/* Color Filter */}
                                <Text style={styles.filterSectionTitle}>
                                    Color
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styles.menuItem,
                                        !filterBy.color &&
                                            styles.activeMenuItem,
                                    ]}
                                    onPress={() =>
                                        setFilterBy((prev) => ({
                                            ...prev,
                                            color: '',
                                        }))
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.menuItemText,
                                            !filterBy.color &&
                                                styles.activeMenuItemText,
                                        ]}
                                    >
                                        All Colors
                                    </Text>
                                </TouchableOpacity>
                                {filterOptions.colors.map((color) => (
                                    <TouchableOpacity
                                        key={color}
                                        style={[
                                            styles.menuItem,
                                            filterBy.color === color &&
                                                styles.activeMenuItem,
                                        ]}
                                        onPress={() =>
                                            setFilterBy((prev) => ({
                                                ...prev,
                                                color,
                                            }))
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.menuItemText,
                                                filterBy.color === color &&
                                                    styles.activeMenuItemText,
                                            ]}
                                        >
                                            {color}
                                        </Text>
                                    </TouchableOpacity>
                                ))}

                                {/* Brand Filter */}
                                <Text style={styles.filterSectionTitle}>
                                    Brand
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styles.menuItem,
                                        !filterBy.brand &&
                                            styles.activeMenuItem,
                                    ]}
                                    onPress={() =>
                                        setFilterBy((prev) => ({
                                            ...prev,
                                            brand: '',
                                        }))
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.menuItemText,
                                            !filterBy.brand &&
                                                styles.activeMenuItemText,
                                        ]}
                                    >
                                        All Brands
                                    </Text>
                                </TouchableOpacity>
                                {filterOptions.brands.map((brand) => (
                                    <TouchableOpacity
                                        key={brand}
                                        style={[
                                            styles.menuItem,
                                            filterBy.brand === brand &&
                                                styles.activeMenuItem,
                                        ]}
                                        onPress={() =>
                                            setFilterBy((prev) => ({
                                                ...prev,
                                                brand,
                                            }))
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.menuItemText,
                                                filterBy.brand === brand &&
                                                    styles.activeMenuItemText,
                                            ]}
                                        >
                                            {brand}
                                        </Text>
                                    </TouchableOpacity>
                                ))}

                                {/* Tags Filter */}
                                <Text style={styles.filterSectionTitle}>
                                    Tags
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styles.menuItem,
                                        !filterBy.tags && styles.activeMenuItem,
                                    ]}
                                    onPress={() =>
                                        setFilterBy((prev) => ({
                                            ...prev,
                                            tags: '',
                                        }))
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.menuItemText,
                                            !filterBy.tags &&
                                                styles.activeMenuItemText,
                                        ]}
                                    >
                                        All Tags
                                    </Text>
                                </TouchableOpacity>
                                {filterOptions.tags.map((tag) => (
                                    <TouchableOpacity
                                        key={tag}
                                        style={[
                                            styles.menuItem,
                                            filterBy.tags === tag &&
                                                styles.activeMenuItem,
                                        ]}
                                        onPress={() =>
                                            setFilterBy((prev) => ({
                                                ...prev,
                                                tags: tag,
                                            }))
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.menuItemText,
                                                filterBy.tags === tag &&
                                                    styles.activeMenuItemText,
                                            ]}
                                        >
                                            {tag}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading...</Text>
                        </View>
                    ) : clothes.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>
                                Your Wardrobe Is Empty
                            </Text>
                            <Text style={styles.emptySubtext}>
                                Start by adding your first clothing item
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredAndSortedClothes}
                            keyExtractor={(item: any) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.clothingItem}
                                    onPress={() =>
                                        router.push(`/ItemDetail?id=${item.id}`)
                                    }
                                >
                                    <Text style={styles.itemName}>
                                        {item.name}
                                    </Text>
                                    {item.brand && (
                                        <Text style={styles.itemBrand}>
                                            {item.brand}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    header: {
        padding: 20,
        backgroundColor: '#e5d6b3',
        alignItems: 'center',
    },
    goback: {
        position: 'absolute',
        top: 0,
        left: 0,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    addButton: {
        backgroundColor: '#c19a6b',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#666',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    clothingItem: {
        backgroundColor: 'white',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    itemCategory: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    itemColor: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    itemBrand: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    controlButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    controlButtonText: {
        fontSize: 14,
        color: '#c19a6b',
        fontWeight: '500',
        marginHorizontal: 8,
    },
    menuContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    filterScrollView: {
        maxHeight: 300,
    },
    menuItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    activeMenuItem: {
        backgroundColor: '#f8f4e6',
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
    },
    activeMenuItemText: {
        color: '#c19a6b',
        fontWeight: '600',
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#c19a6b',
        padding: 15,
        paddingBottom: 8,
        backgroundColor: '#f8f9fa',
    },
})
