// Types for Personal Wardrobe Mobile App

export interface ClothingItem {
    id: string
    name: string
    category: ClothingCategory
    color: string
    brand?: string
    season: Season[]
    imageUrl?: string
    tags: string[]
    dateAdded: Date
    lastWorn?: Date
    timesWorn: number
}

export enum ClothingCategory {
    TOPS = 'tops',
    BOTTOMS = 'bottoms',
    DRESSES = 'dresses',
    OUTERWEAR = 'outerwear',
    SHOES = 'shoes',
    ACCESSORIES = 'accessories',
    UNDERGARMENTS = 'undergarments',
}

export enum Season {
    SPRING = 'spring',
    SUMMER = 'summer',
    FALL = 'fall',
    WINTER = 'winter',
}

export interface Outfit {
    id: string
    name: string
    items: ClothingItem[]
    occasion: string
    dateCreated: Date
    timesWorn: number
    imageUrl?: string
    rating?: number
}

export interface User {
    id: string
    name: string
    email: string
    preferences: UserPreferences
}

export interface UserPreferences {
    favoriteColors: string[]
    preferredBrands: string[]
    style: string[]
    size: {
        tops?: string
        bottoms?: string
        shoes?: string
    }
}
