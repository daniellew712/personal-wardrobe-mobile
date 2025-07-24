import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { authService } from '../services/authService'
import { firestoreService } from '../services/firestoreService'

export default function FirebaseTest() {
    const [testResult, setTestResult] = useState<string>('')

    const testFirebaseConnection = async () => {
        try {
            setTestResult('Testing Firebase connection...')

            // Test Firestore connection by attempting to read from a test collection
            await firestoreService.getDocuments('test')

            setTestResult('✅ Firebase connection successful!')
        } catch (error: any) {
            console.error('Firebase test error:', error)
            setTestResult(`❌ Firebase connection failed: ${error.message}`)
        }
    }

    const testAuthConnection = async () => {
        try {
            setTestResult('Testing Auth connection...')

            // Check if auth is properly initialized
            const currentUser = authService.getCurrentUser()

            setTestResult(
                `✅ Auth connection successful! Current user: ${currentUser ? currentUser.email : 'None'}`
            )
        } catch (error: any) {
            console.error('Auth test error:', error)
            setTestResult(`❌ Auth connection failed: ${error.message}`)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Firebase Connection Test</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={testFirebaseConnection}
            >
                <Text style={styles.buttonText}>Test Firestore Connection</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={testAuthConnection}
            >
                <Text style={styles.buttonText}>Test Auth Connection</Text>
            </TouchableOpacity>

            {testResult ? (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>{testResult}</Text>
                </View>
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f0f0f0',
        margin: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
    },
    resultContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    resultText: {
        fontSize: 14,
        textAlign: 'center',
    },
})
