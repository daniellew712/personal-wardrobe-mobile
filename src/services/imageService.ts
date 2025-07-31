import { storage } from '../lib/firebase'
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage'

// Upload an image and return its download URL
export async function uploadImage(uri: string, path: string): Promise<string> {
    const response = await fetch(uri)
    const blob = await response.blob()
    const fileRef = ref(storage, path)
    await uploadBytes(fileRef, blob)
    return await getDownloadURL(fileRef)
}

// Delete an image by its storage path
export async function deleteImage(path: string): Promise<void> {
    const fileRef = ref(storage, path)
    await deleteObject(fileRef)
}

// Get a download URL for an image by its storage path
export async function getImageUrl(path: string): Promise<string> {
    const fileRef = ref(storage, path)
    return await getDownloadURL(fileRef)
}
