// manage the authetication state through the whole app
import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    ImageBackground,
} from 'react-native'

interface LoadingScreenProps {
    message?: string
}

export default function LoadingScreen({
    message = 'Loading...',
}: LoadingScreenProps) {
    return (
        <ImageBackground
            source={require('../assets/Image.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.appName}>Waves</Text>
                        <Text style={styles.tagline}>Organize your style</Text>
                    </View>

                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#6B73FF" />
                        <Text style={styles.loadingText}>{message}</Text>
                    </View>
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
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#6B73FF',
        marginBottom: 8,
        textAlign: 'center',
    },
    tagline: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
})
