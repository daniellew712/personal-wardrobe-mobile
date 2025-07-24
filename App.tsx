import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { AuthProvider } from './src/contexts/AuthContext'
import HomeScreen from './src/screens/HomeScreen'

export default function App() {
    return (
        <AuthProvider>
            <HomeScreen />
            <StatusBar style="light" />
        </AuthProvider>
    )
}
