import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    ScrollView,
    // used for AI part
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Image,
    ImageBackground,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { apiService } from '../src/services/api'

export default function ItemDetailScreen() {
    const { id } = useLocalSearchParams()
    const [item, setItem] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    // ai api
    // Chat
    const [chatMessages, setChatMessages] = useState<
        { id: string; text: string; isUser: boolean; timestamp: string }[]
    >([])
    const [inputMessage, setInputMessage] = useState('')
    const [chatLoading, setChatLoading] = useState(false)
    const [showChat, setShowChat] = useState(false)

    const sendMessage = async () => {
        if (!inputMessage.trim() || chatLoading) return

        const userMessage = {
            id: Date.now().toString(),
            text: inputMessage.trim(),
            isUser: true,
            timestamp: new Date().toISOString(),
        }

        setChatMessages((prev) => [...prev, userMessage])
        setInputMessage('')
        setChatLoading(true)

        try {
            const contextMessage = `I have a ${item?.category || 'clothing item'} called "${item?.name || 'this item'}"${
                item?.brand ? ` from ${item.brand}` : ''
            }${item?.color ? ` in ${item.color}` : ''}${item?.size ? `, size ${item.size}` : ''}${
                item?.material ? `, made of ${item.material}` : ''
            }. ${inputMessage.trim()}`

            console.log('Sending chat message:', contextMessage)
            const response = await apiService.sendChatMessage(contextMessage)
            console.log('Chat response:', response)

            const aiMessage = {
                id: (Date.now() + 1).toString(),
                text: response.message,
                isUser: false,
                timestamp: response.timestamp,
            }

            setChatMessages((prev) => [...prev, aiMessage])
        } catch (error: any) {
            console.error('Chat error:', error)
            if (error.response) {
                Alert.alert(
                    'Error',
                    `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
                )
            } else if (error.request) {
                Alert.alert(
                    'Error',
                    'No response from server. Check if backend is running.'
                )
            } else {
                Alert.alert('Error', `Request error: ${error.message}`)
            }
        } finally {
            setChatLoading(false)
        }
    }

    // AI API comment
    useEffect(() => {
        const loadItemDetail = async () => {
            try {
                const data = await apiService.getClothingItem(id as string)
                setItem(data)
            } catch (error) {
                console.error('Error:', error)
                Alert.alert('Error', 'Could not load item details')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            loadItemDetail()
        }
    }, [id])

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        )
    }

    if (!item) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Item Not Found</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Item not found</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <ImageBackground
            source={require('../assets/wardrobePage.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Item Details</Text>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={async () => {
                            try {
                                await apiService.deleteClothingItem(
                                    id as string
                                )
                                Alert.alert('Deleted', 'Item deleted!')
                                router.back()
                            } catch (error) {
                                Alert.alert('Error', 'Failed to delete item')
                            }
                        }}
                    >
                        <Ionicons name="trash" size={22} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView style={styles.content}>
                    <View style={styles.rowContainer}>
                        <View style={styles.imageContainer}>
                            {item.imageUrl && (
                                <Image
                                    source={{ uri: item.imageUrl }}
                                    style={styles.detailImage}
                                />
                            )}
                            {/* Heart Button */}
                            <TouchableOpacity
                                style={styles.heartButton}
                                onPress={async () => {
                                    try {
                                        const updated =
                                            await apiService.putClothingItem(
                                                id as string,
                                                { favorite: !item.favorite }
                                            )
                                        setItem((prev: any) => ({
                                            ...prev,
                                            favorite: updated.favorite,
                                        }))
                                    } catch {
                                        Alert.alert('Failed to update favorite')
                                    }
                                }}
                            >
                                <Ionicons
                                    name={
                                        item.favorite
                                            ? 'heart'
                                            : 'heart-outline'
                                    }
                                    size={18}
                                    color={item.favorite ? '#e74c3c' : '#aaa'}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.fixedDetailCard}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Category:</Text>
                                <Text style={styles.value}>
                                    {item.category}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Color:</Text>
                                <Text style={styles.value}>{item.color}</Text>
                            </View>
                            {item.brand && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.label}>Brand:</Text>
                                    <Text style={styles.value}>
                                        {item.brand}
                                    </Text>
                                </View>
                            )}
                            {item.size && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.label}>Size:</Text>
                                    <Text style={styles.value}>
                                        {item.size}
                                    </Text>
                                </View>
                            )}
                            {item.material && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.label}>Material:</Text>
                                    <Text style={styles.value}>
                                        {item.material}
                                    </Text>
                                </View>
                            )}
                            {item.tags && item.tags.length > 0 && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.label}>Tags:</Text>
                                    <Text style={styles.value}>
                                        {item.tags.join(', ')}
                                    </Text>
                                </View>
                            )}
                            {item.notes && (
                                <View style={styles.notesSection}>
                                    <Text style={styles.label}>Notes:</Text>
                                    <Text style={styles.notesText}>
                                        {item.notes}
                                    </Text>
                                </View>
                            )}
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() =>
                                    router.push({
                                        pathname: '/editItem',
                                        params: { id },
                                    })
                                }
                            >
                                <Ionicons
                                    name="pencil"
                                    size={18}
                                    color="#c19a6b"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Chat Section */}
                    <View style={styles.chatSection}>
                        <TouchableOpacity
                            style={styles.chatToggle}
                            onPress={() => setShowChat(!showChat)}
                        >
                            <Ionicons
                                name="chatbubble-outline"
                                size={20}
                                color="#c19a6b"
                            />
                            <Text style={styles.chatToggleText}>
                                AI Styling Assistant
                            </Text>
                            <Ionicons
                                name={showChat ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color="#c19a6b"
                            />
                        </TouchableOpacity>

                        {showChat && (
                            <View style={styles.chatContainer}>
                                <ScrollView style={styles.chatMessages}>
                                    {chatMessages.length === 0 ? (
                                        <Text style={styles.chatPlaceholder}>
                                            Ask me anything about styling this
                                            item!
                                        </Text>
                                    ) : (
                                        chatMessages.map((message) => (
                                            <View
                                                key={message.id}
                                                style={[
                                                    styles.messageContainer,
                                                    message.isUser
                                                        ? styles.userMessage
                                                        : styles.aiMessage,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.messageText,
                                                        message.isUser
                                                            ? styles.userMessageText
                                                            : styles.aiMessageText,
                                                    ]}
                                                >
                                                    {message.text}
                                                </Text>
                                            </View>
                                        ))
                                    )}
                                    {chatLoading && (
                                        <View
                                            style={[
                                                styles.messageContainer,
                                                styles.aiMessage,
                                            ]}
                                        >
                                            <Text style={styles.aiMessageText}>
                                                Generating...
                                            </Text>
                                        </View>
                                    )}
                                </ScrollView>

                                <KeyboardAvoidingView
                                    behavior={
                                        Platform.OS === 'ios'
                                            ? 'padding'
                                            : 'height'
                                    }
                                    style={styles.chatInputContainer}
                                >
                                    <TextInput
                                        style={styles.chatInput}
                                        value={inputMessage}
                                        onChangeText={setInputMessage}
                                        placeholder="Ask about styling, matching, or care..."
                                        placeholderTextColor="#999"
                                        multiline
                                        maxLength={500}
                                    />
                                    <TouchableOpacity
                                        style={[
                                            styles.sendButton,
                                            (!inputMessage.trim() ||
                                                chatLoading) &&
                                                styles.sendButtonDisabled,
                                        ]}
                                        onPress={sendMessage}
                                        disabled={
                                            !inputMessage.trim() || chatLoading
                                        }
                                    >
                                        <Ionicons
                                            name="send"
                                            size={20}
                                            color="white"
                                        />
                                    </TouchableOpacity>
                                </KeyboardAvoidingView>
                            </View>
                        )}
                    </View>
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
        padding: 12,
        backgroundColor: '#e5d6b3',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    editButton: {
        position: 'absolute',
        right: 16,
        bottom: 12,
        padding: 8,
        zIndex: 2,
    },
    deleteButton: {
        position: 'absolute',
        right: 20,
        top: 12,
        padding: 8,
        zIndex: 2,
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 20,
    },
    imageContainer: {
        width: 150,
        height: 220,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
        position: 'relative',
    },
    detailImage: {
        width: 140,
        height: 200,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    heartButton: {
        position: 'absolute',
        right: 8,
        bottom: 12,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    fixedDetailCard: {
        width: 220,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    itemName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        width: 80,
    },
    value: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    notesSection: {
        marginTop: 10,
    },
    notesText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
        marginTop: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#999',
    },
    chatSection: {
        marginTop: 20,
    },
    chatToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    chatToggleText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#c19a6b',
        flex: 1,
        marginLeft: 10,
    },
    chatContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    chatMessages: {
        maxHeight: 300,
        padding: 15,
    },
    chatPlaceholder: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
        paddingVertical: 20,
    },
    messageContainer: {
        marginBottom: 10,
        maxWidth: '80%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#c19a6b',
        borderRadius: 15,
        borderBottomRightRadius: 5,
        padding: 10,
    },
    aiMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        borderBottomLeftRadius: 5,
        padding: 10,
    },
    messageText: {
        fontSize: 14,
        lineHeight: 18,
    },
    userMessageText: {
        color: 'white',
    },
    aiMessageText: {
        color: '#333',
    },
    chatInputContainer: {
        flexDirection: 'row',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'flex-end',
    },
    chatInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        maxHeight: 100,
        fontSize: 14,
    },
    sendButton: {
        backgroundColor: '#c19a6b',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
    },
})
