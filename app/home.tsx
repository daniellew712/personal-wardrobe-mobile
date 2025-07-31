import React from 'react'
import { apiService } from '../src/services/api'
import { router } from 'expo-router'
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    ImageBackground,
    Image,
    Dimensions,
} from 'react-native'
import { useAuth } from '../src/contexts/AuthContext'
import { Ionicons } from '@expo/vector-icons'

export default function HomeScreen() {
    const { user, loading } = useAuth()
    const [favoriteColor, setFavoriteColor] = React.useState('white')
    React.useEffect(() => {
        const fetchWardrobeColors = async () => {
            try {
                const items: { color?: string }[] =
                    await apiService.getClothes()
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
            }
        }
        fetchWardrobeColors()
    }, [])
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
                            <Text style={styles.userInfo}>
                                Welcome, {user.email}
                            </Text>
                            <TouchableOpacity
                                style={styles.closetnavigator}
                                onPress={() => router.push('/wardrobe')}
                            >
                                <Text style={styles.closetText}>
                                    View My Closet
                                </Text>
                            </TouchableOpacity>
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
                <ScrollView horizontal={true}>
                    {/* gallery items go here */}
                </ScrollView>
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
    settingsIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
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
        marginTop: 10,
        alignSelf: 'flex-start',
        minWidth: 100,
    },
    userInfo: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 8,
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
        gap: 40,
        marginVertical: 50,
    },
    circleContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#A47764',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    circleText: {
        fontSize: 14,
        color: 'light black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
})
