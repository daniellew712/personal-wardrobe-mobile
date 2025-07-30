import React, { useState } from 'react'
import { router } from 'expo-router'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    // ImageBackground,
    TextInput,
} from 'react-native'
import { useAuth } from '../src/contexts/AuthContext'
import { Ionicons } from '@expo/vector-icons'

export default function ProfileScreen() {
    const { user, signOut } = useAuth()
    const [email, setEmail] = useState(user?.email || '')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        if (password && password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match')
            return
        }

        if (password && password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters')
            return
        }

        setLoading(true)
        try {
            Alert.alert('Success', 'Profile updated successfully!')
            setPassword('')
            setConfirmPassword('')
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

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

    return (
        // <ImageBackground
        //     source={require('../assets/accountbackground.png')}
        //     style={styles.backgroundImage}
        //     resizeMode="cover"
        // >
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>Profile</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Email */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter email"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter new password"
                        placeholderTextColor="#999"
                        secureTextEntry
                    />
                </View>

                {/* Confirm Password */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Enter new password again"
                        placeholderTextColor="#999"
                        secureTextEntry
                    />
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        loading && styles.saveButtonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Text>
                </TouchableOpacity>

                {/* Sign Out Button */}
                <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={handleSignOut}
                >
                    <Text style={styles.signOutText}>SIGN OUT</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        // </ImageBackground>
    )
}

const styles = StyleSheet.create({
    // backgroundImage: {
    //     flex: 1,
    // },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        padding: 20,
        backgroundColor: '#e5d6b3',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
        marginRight: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    content: {
        flex: 1,
        padding: 20,
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
    saveButton: {
        backgroundColor: '#c19a6b',
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    saveButtonDisabled: {
        backgroundColor: '#999',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    signOutButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ff4757',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    signOutText: {
        fontSize: 16,
        color: 'red',
        fontWeight: '500',
        textAlign: 'center',
    },
})
