import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useProfilePicture } from '../hooks/useProfilePicture'

interface ProfilePictureProps {
    size?: number
    showEditButton?: boolean
    defaultImage?: any
    editButtonStyle?: any
    imageStyle?: any
}

const DEFAULT_PROFILE_IMAGE = require('../../assets/icon.png')

export default function ProfilePicture({
    size = 60,
    showEditButton = true,
    defaultImage = DEFAULT_PROFILE_IMAGE,
    editButtonStyle,
    imageStyle,
}: ProfilePictureProps) {
    const { imageUri, uploading, updateProfilePicture } = useProfilePicture()

    const profileImageStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: 'grey',
        ...imageStyle,
    }

    const editButtonDefaultStyle = {
        position: 'absolute' as const,
        bottom: -7,
        right: -7,
        padding: 6,
        borderRadius: 16,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        ...editButtonStyle,
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={showEditButton ? updateProfilePicture : undefined}
            disabled={uploading}
            activeOpacity={showEditButton ? 0.7 : 1}
        >
            <Image
                source={imageUri ? { uri: imageUri } : defaultImage}
                style={profileImageStyle}
            />
            {showEditButton && (
                <TouchableOpacity
                    style={editButtonDefaultStyle}
                    onPress={updateProfilePicture}
                    disabled={uploading}
                >
                    <Ionicons
                        name="camera"
                        size={20}
                        color={uploading ? '#ccc' : 'white'}
                    />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
})
