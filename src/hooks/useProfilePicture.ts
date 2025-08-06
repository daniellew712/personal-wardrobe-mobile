import { useState } from 'react'
import { Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { uploadImage } from '../services/imageService'
import { updateProfile } from 'firebase/auth'
import { useAuth } from '../contexts/AuthContext'

export const useProfilePicture = () => {
    const { user } = useAuth()
    const [uploading, setUploading] = useState(false)
    const [imageUri, setImageUri] = useState<string | null>(
        user?.photoURL || null
    )

    const updateProfilePicture = async () => {
        if (!user) {
            Alert.alert(
                'Error, You must be logged in to update your profile picture.'
            )
            return
        }

        try {
            // Request permission
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (!permissionResult.granted) {
                Alert.alert('Permission required to access images library!')
                return
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.7,
            })

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setUploading(true)

                const uri = result.assets[0].uri
                const path = `profilePictures/${user.uid}_${Date.now()}.jpg`

                // Upload to Firebase Storage
                const uploadedUrl = await uploadImage(uri, path)

                // Update Firebase user profile
                await updateProfile(user, { photoURL: uploadedUrl })

                // Update local state
                setImageUri(uploadedUrl)

                Alert.alert('Success, Profile picture updated!')
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile picture.')
        } finally {
            setUploading(false)
        }
    }

    return {
        imageUri,
        uploading,
        updateProfilePicture,
    }
}
