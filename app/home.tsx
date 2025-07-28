import React from 'react'
import { Link, router } from 'expo-router'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    ImageBackground,
} from 'react-native'
import { useAuth } from '../src/contexts/AuthContext'

export default function HomeScreen() {
    const { user, loading, signOut } = useAuth()

    const handleSignOut = async () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await signOut()
                        router.replace('/auth/login')
                    } catch {
                        Alert.alert('Error', 'Failed to sign out')
                    }
                },
            },
        ])
    }

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
                    <Text style={styles.title}>Personal Wardrobe</Text>
                    <Text style={styles.subtitle}>Find Your Perfect Style</Text>
                    {user && (
                        <View style={styles.userContainer}>
                            <Text style={styles.userInfo}>
                                Welcome, {user.email}
                            </Text>
                            <TouchableOpacity
                                style={styles.signOutButton}
                                onPress={handleSignOut}
                            >
                                <Text style={styles.signOutText}>Sign Out</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {!user && (
                        <Text style={styles.userInfo}>Not authenticated</Text>
                    )}
                </View>

                <View style={styles.content}>
                    <Link href="/wardrobe" asChild>
                        <TouchableOpacity style={styles.card}>
                            <Text style={styles.cardTitle}>My Clothes</Text>
                            <Text style={styles.cardSubtitle}>
                                Browse your wardrobe
                            </Text>
                        </TouchableOpacity>
                    </Link>

                    <TouchableOpacity style={styles.card}>
                        <Text style={styles.cardTitle}>Outfits</Text>
                        <Text style={styles.cardSubtitle}>
                            Create and save outfits
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card}>
                        <Text style={styles.cardTitle}>Add Item</Text>
                        <Text style={styles.cardSubtitle}>
                            Add new clothing items
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card}>
                        <Text style={styles.cardTitle}>Statistics</Text>
                        <Text style={styles.cardSubtitle}>
                            View wearing patterns
                        </Text>
                    </TouchableOpacity>
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    userInfo: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 8,
        fontStyle: 'italic',
    },
    userContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    signOutButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginTop: 8,
    },
    signOutText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
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
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
    },
})
