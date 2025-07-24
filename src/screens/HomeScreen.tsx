import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native'
import { useAuth } from '../contexts/AuthContext'
import FirebaseTest from '../components/FirebaseTest'

export default function HomeScreen() {
    const { user, loading } = useAuth()

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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Personal Wardrobe</Text>
                <Text style={styles.subtitle}>Organize your style</Text>
                {user && (
                    <Text style={styles.userInfo}>Welcome, {user.email}</Text>
                )}
                {!user && (
                    <Text style={styles.userInfo}>Not authenticated</Text>
                )}
            </View>

            <View style={styles.content}>
                <FirebaseTest />

                <TouchableOpacity style={styles.card}>
                    <Text style={styles.cardTitle}>My Clothes</Text>
                    <Text style={styles.cardSubtitle}>
                        Browse your wardrobe
                    </Text>
                </TouchableOpacity>

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
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#6B73FF',
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
