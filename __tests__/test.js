// 8 categories
const CLOTHING_CATEGORIES = {
    TOPS: 'tops',
    BOTTOMS: 'bottoms',
    DRESSES: 'dresses',
    OUTERWEAR: 'outerwear',
    SHOES: 'shoes',
    HANDBAGS: 'handbags',
    ACTIVEWEAR: 'activewear',
    ACCESSORIES: 'accessories',
}

// Wardrobe filtering logic
function filterClothes(clothes, filterBy) {
    return clothes.filter((item) => {
        if (filterBy.category && item.category !== filterBy.category)
            return false
        if (filterBy.color && item.color !== filterBy.color) return false
        if (filterBy.brand && item.brand !== filterBy.brand) return false
        if (filterBy.tags && !item.tags?.includes(filterBy.tags)) return false
        return true
    })
}

// Wardrobe sorting logic
function sortClothes(clothes, sortBy) {
    return clothes.sort((a, b) => {
        switch (sortBy) {
            case 'purchaseDate':
                return (
                    new Date(b.purchaseDate || 0).getTime() -
                    new Date(a.purchaseDate || 0).getTime()
                )
            case 'size':
                const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
                const aIndex = sizeOrder.indexOf(a.size || '')
                const bIndex = sizeOrder.indexOf(b.size || '')
                return (
                    (aIndex === -1 ? 999 : aIndex) -
                    (bIndex === -1 ? 999 : bIndex)
                )
            default:
                return (a.name || '').localeCompare(b.name || '')
        }
    })
}

// Statistics page logic
function getCategoryCounts(clothes) {
    const categories = Object.values(CLOTHING_CATEGORIES)
    const counts = {}

    categories.forEach((category) => {
        counts[category] = 0
    })

    clothes.forEach((item) => {
        if (item.category && counts.hasOwnProperty(item.category)) {
            counts[item.category]++
        }
    })

    return counts
}

// Tag counting for resell/donate analysis
function getResellDonateTagCounts(clothes) {
    let withTags = 0
    let withoutTags = 0

    clothes.forEach((item) => {
        const hasResellOrDonate = item.tags?.some(
            (tag) =>
                tag.toLowerCase() === 'resell' || tag.toLowerCase() === 'donate'
        )

        if (hasResellOrDonate) {
            withTags++
        } else {
            withoutTags++
        }
    })

    return { withTags, withoutTags }
}

// Test the core wardrobe functionality
describe('Wardrobe App Core Features', () => {
    describe('Clothing Categories', () => {
        test('has all required categories', () => {
            expect(CLOTHING_CATEGORIES.TOPS).toBe('tops')
            expect(CLOTHING_CATEGORIES.BOTTOMS).toBe('bottoms')
            expect(Object.keys(CLOTHING_CATEGORIES)).toHaveLength(8)
        })
    })

    describe('Wardrobe Filtering Features', () => {
        const sampleClothes = [
            {
                id: '1',
                name: 'Red T-Shirt',
                category: 'tops',
                color: 'red',
                brand: 'Nike',
                tags: ['casual'],
            },
            {
                id: '2',
                name: 'Blue Jeans',
                category: 'bottoms',
                color: 'blue',
                brand: 'Levi',
                tags: ['casual'],
            },
            {
                id: '3',
                name: 'Black Dress',
                category: 'dresses',
                color: 'black',
                brand: 'Zara',
                tags: ['formal'],
            },
            {
                id: '4',
                name: 'White Sneakers',
                category: 'shoes',
                color: 'white',
                brand: 'Nike',
                tags: ['resell'],
            },
        ]

        test('filters by category correctly', () => {
            const filtered = filterClothes(sampleClothes, { category: 'tops' })
            expect(filtered).toHaveLength(1)
            expect(filtered[0].name).toBe('Red T-Shirt')
        })

        test('filters by multiple criteria', () => {
            const filtered = filterClothes(sampleClothes, {
                brand: 'Nike',
                color: 'white',
            })
            expect(filtered).toHaveLength(1)
            expect(filtered[0].name).toBe('White Sneakers')
        })

        test('filters by tags correctly', () => {
            const filtered = filterClothes(sampleClothes, { tags: 'resell' })
            expect(filtered).toHaveLength(1)
            expect(filtered[0].name).toBe('White Sneakers')
        })

        test('returns empty array when no matches', () => {
            const filtered = filterClothes(sampleClothes, {
                category: 'none',
            })
            expect(filtered).toHaveLength(0)
        })
    })

    describe('Wardrobe Sorting Features', () => {
        const sampleClothes = [
            { name: 'Checkered Shirt', size: 'L', purchaseDate: '2025-01-01' },
            { name: 'Floral Dress', size: 'S', purchaseDate: '2025-03-01' },
            { name: 'Blue Jeans', size: 'M', purchaseDate: '2025-02-01' },
        ]

        test('sorts by name alphabetically', () => {
            const sorted = sortClothes([...sampleClothes], 'name')
            expect(sorted[0].name).toBe('Blue Jeans')
            expect(sorted[1].name).toBe('Checkered Shirt')
            expect(sorted[2].name).toBe('Floral Dress')
        })

        test('sorts by purchase date (newest first)', () => {
            const sorted = sortClothes([...sampleClothes], 'purchaseDate')
            expect(sorted[0].purchaseDate).toBe('2025-03-01')
            expect(sorted[2].purchaseDate).toBe('2025-01-01')
        })

        test('sorts by size correctly', () => {
            const sorted = sortClothes([...sampleClothes], 'size')
            expect(sorted[0].size).toBe('S')
            expect(sorted[1].size).toBe('M')
            expect(sorted[2].size).toBe('L')
        })
    })

    describe('Statistics Features', () => {
        const sampleClothes = [
            { category: 'tops', tags: ['casual'] },
            { category: 'tops', tags: ['work'] },
            { category: 'bottoms', tags: ['resell'] },
            { category: 'dresses', tags: ['donate'] },
            { category: 'shoes', tags: ['casual'] },
        ]

        test('calculates category counts correctly', () => {
            const counts = getCategoryCounts(sampleClothes)
            expect(counts.tops).toBe(2)
            expect(counts.bottoms).toBe(1)
            expect(counts.dresses).toBe(1)
            expect(counts.shoes).toBe(1)
            expect(counts.outerwear).toBe(0)
        })

        test('counts resell/donate tags correctly', () => {
            const tagCounts = getResellDonateTagCounts(sampleClothes)
            expect(tagCounts.withTags).toBe(2)
            expect(tagCounts.withoutTags).toBe(3)
        })
    })
})
