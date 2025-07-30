import React from 'react'
import { router } from 'expo-router'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ImageBackground,
} from 'react-native'

export default function WelcomeScreen() {
    const handleGetStarted = () => {
        router.push('/auth/login')
    }

    return (
        <ImageBackground
            source={require('../assets/Image.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    {/* Brand Section */}
                    <View style={styles.brandContainer}>
                        <Text style={styles.brandName}>Waves</Text>
                    </View>

                    {/* Action Section */}
                    <View style={styles.actionContainer}>
                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={handleGetStarted}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.startButtonText}>START</Text>
                        </TouchableOpacity>
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
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for better text readability
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingVertical: 60,
    },
    brandContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    brandName: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    actionContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    startButton: {
        backgroundColor: 'black',
        paddingHorizontal: 50,
        paddingVertical: 18,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#816802',
        elevation: 8,
        marginBottom: 20,
    },
    startButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#816802',
        textAlign: 'center',
    },
})
