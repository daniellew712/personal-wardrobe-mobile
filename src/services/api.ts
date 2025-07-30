import axios from 'axios'
import { auth } from '../lib/firebase' // You'll need to import my Firebase config

const API_URL = 'http://192.168.86.27:3000' // Replace with my computer's IP address

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
})

// Add Firebase token to requests
api.interceptors.request.use(
    async (config) => {
        try {
            const user = auth.currentUser
            if (user) {
                const token = await user.getIdToken()
                config.headers.Authorization = `Bearer ${token}`
            }
        } catch (error) {
            console.error('Error getting Firebase token:', error)
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export const apiService = {
    // Auth
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password })
        return response.data
    },

    register: async (email: string, password: string) => {
        const response = await api.post('/auth/signup', { email, password })
        return response.data
    },

    // Wardrobe
    getClothes: async () => {
        const response = await api.get('/clothing')
        return response.data
    },

    addClothingItem: async (item: any) => {
        const response = await api.post('/clothing', item)
        return response.data
    },

    getClothingItem: async (id: string) => {
        const response = await api.get(`/clothing/${id}`)
        return response.data
    },

    // AI Chat
    sendChatMessage: async (message: string) => {
        const response = await api.post('/chat', { message })
        return response.data
    },
}
