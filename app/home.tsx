import React from 'react'
import { apiService } from '../src/services/api'
import { router } from 'expo-router'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ImageBackground,
} from 'react-native'
import { useAuth } from '../src/contexts/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import Divider from '../components/Divider'
import ProfilePicture from '../src/components/ProfilePicture'
import Slider from '../components/Slider'

export default function HomeScreen() {
    const { user, loading } = useAuth()

    const [favoriteClothes, setFavoriteClothes] = React.useState<any[]>([])
    const [favoriteColor, setFavoriteColor] = React.useState('white')
    const [isLoadingFavorites, setIsLoadingFavorites] = React.useState(true)

    React.useEffect(() => {
        const fetchWardrobeData = async () => {
            try {
                const items: any[] = await apiService.getClothes()
                console.log('All items:', items)
                console.log('Total items count:', items.length)

                // Filter for favorite items
                const favorites = items.filter((item) => item.favorite === true)
                console.log('Favorite items found:', favorites.length)

                // Transform favorite Items to match Slider interface
                const transformedFavorites = favorites.map((item) => ({
                    id: item.id,
                    name: item.name || 'Clothing Item',
                    imageUrl: item.imageUrl || item.image,
                }))

                setFavoriteClothes(transformedFavorites)
                setIsLoadingFavorites(false)

                // Calculate favorite color
                const colorCounts: Record<string, number> = {}
                items.forEach((item) => {
                    if (item.color) {
                        colorCounts[item.color] =
                            (colorCounts[item.color] || 0) + 1
                    }
                })
                // Find the color with the highest count
                let maxColor = '#f5e6c5'
                let maxCount = 0
                Object.entries(colorCounts).forEach(([color, count]) => {
                    if (typeof count === 'number' && count > maxCount) {
                        maxColor = color
                        maxCount = count
                    }
                })
                setFavoriteColor(maxColor)
            } catch (error) {
                console.error('Failed to fetch wardrobe items:', error)
                setIsLoadingFavorites(false)
            }
        }

        if (user) {
            fetchWardrobeData()
        }
    }, [user])

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <ImageBackground
            source={require('../assets/accountbackground.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    {user && (
                        <View style={styles.userContainer}>
                            <View style={styles.profileRow}>
                                <ProfilePicture />
                                <Text style={styles.userInfo}>
                                    Welcome, {user.email}
                                </Text>
                            </View>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={styles.closetnavigator}
                                    onPress={() => router.push('/wardrobe')}
                                >
                                    <Text style={styles.closetText}>
                                        View My Closet
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.statNavigator}
                                    onPress={() => router.push('/statistics')}
                                >
                                    <Text style={styles.statText}>
                                        Closet Statistics
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={styles.settingsIcon}
                                onPress={() => router.push('/profile')}
                            >
                                <Ionicons
                                    name="settings-outline"
                                    size={24}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                    {!user && (
                        <Text style={styles.userInfo}>Not authenticated</Text>
                    )}
                </View>
                <View style={styles.colorStatContainer}>
                    <View
                        style={[
                            styles.circleContainer,
                            { backgroundColor: favoriteColor || '#f5e6c5' },
                        ]}
                    >
                        <Text style={styles.circleText}>My Favorite Color</Text>
                    </View>
                    <View style={styles.circleContainer}>
                        <Text style={styles.circleText}>Color of 2025</Text>
                    </View>
                </View>
                <Divider style={{ backgroundColor: 'white', height: 2 }} />
                <View>
                    <Text style={styles.galleryHeader}>
                        MY FAVORITE CLOTHES:
                    </Text>
                </View>
                <Slider data={isLoadingFavorites ? [] : favoriteClothes} />
                <Text style={styles.homeFooter}>
                    Waves Member Since{' '}
                    {user?.metadata?.creationTime
                        ? new Date(user.metadata.creationTime).getFullYear()
                        : new Date().getFullYear()}
                </Text>
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
        padding: 12,
        backgroundColor: '#e5d6b3',
        alignItems: 'center',
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },
    settingsIcon: {
        position: 'absolute',
        top: -5,
        right: -2,
        padding: 5,
        borderRadius: 30,
    },
    closetText: {
        fontSize: 10,
        fontWeight: 500,
        color: 'white',
    },
    closetnavigator: {
        backgroundColor: 'black',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
        minWidth: 100,
    },
    statNavigator: {
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 100,
    },
    statText: {
        fontSize: 10,
        fontWeight: 500,
        color: 'black',
    },
    userInfo: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 8,
        marginLeft: 20,
        fontStyle: 'italic',
    },
    userContainer: {
        alignItems: 'flex-start',
        marginTop: 8,
        width: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#666',
    },
    content: {
        flex: 1,
        padding: 20,
        gap: 15,
    },
    colorStatContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
        marginVertical: 30,
    },
    circleContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#A47764',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 2,
    },
    circleText: {
        fontSize: 14,
        color: 'light black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    galleryHeader: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 30,
    },
    homeFooter: {
        fontSize: 16,
        color: 'black',
        opacity: 0.6,
        textAlign: 'center',
        marginTop: 80,
        fontStyle: 'italic',
    },
})
