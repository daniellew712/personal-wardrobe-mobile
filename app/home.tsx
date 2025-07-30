import React from 'react'
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
    const { user, loading, signOut } = useAuth()

    // const handleSignOut = async () => {
    //     Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
    //         { text: 'Cancel', style: 'cancel' },
    //         {
    //             text: 'Sign Out',
    //             style: 'destructive',
    //             onPress: async () => {
    //                 try {
    //                     await signOut()
    //                     router.replace('/auth/login')
    //                 } catch {
    //                     Alert.alert('Error', 'Failed to sign out')
    //                 }
    //             },
    //         },
    //     ])
    // }

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

                <View style={styles.content}>
                    <TouchableOpacity style={styles.card}>
                        <Text style={styles.cardTitle}>Outfits</Text>
                        <Text style={styles.cardSubtitle}>
                            Create and save outfits
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card}>
                        <Text style={styles.cardTitle}>Statistics</Text>
                        <Text style={styles.cardSubtitle}>
                            View wearing patterns
                        </Text>
                    </TouchableOpacity>
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
    closetTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        marginBottom: 2,
    },
    closetSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    // signOutButton: {
    //     backgroundColor: 'rgba(255, 255, 255, 0.2)',
    //     paddingHorizontal: 12,
    //     paddingVertical: 6,
    //     borderRadius: 6,
    //     marginTop: 8,
    // },
    // signOutText: {
    //     color: 'white',
    //     fontSize: 12,
    //     fontWeight: '500',
    // },
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
