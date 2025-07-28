import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native'

export default function WardrobeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Wardrobe</Text>
                <Text style={styles.subtitle}>Manage your clothing items</Text>
            </View>

            <View style={styles.content}>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ Add New Item</Text>
                </TouchableOpacity>

                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Your wardrobe is empty</Text>
                    <Text style={styles.emptySubtext}>
                        Start by adding your first clothing item
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 20,
        backgroundColor: '#c19a6b',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    addButton: {
        backgroundColor: '#c19a6b',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#666',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
})
