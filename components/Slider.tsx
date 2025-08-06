import {
    FlatList,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import React, { useRef, useState } from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const { width } = Dimensions.get('window')
const ITEM_WIDTH = width * 0.6

const defaultImages = [
    {
        id: 'default1',
        name: 'Default Image 1',
        imageUrl: require('../assets/icon.png'),
    },
    {
        id: 'default2',
        name: 'Default Image 2',
        imageUrl: require('../assets/image2.jpg'),
    },
    {
        id: 'default3',
        name: 'Default Image 3',
        imageUrl: require('../assets/hanger1.jpg'),
    },
]

interface SliderItem {
    id: string
    name: string
    imageUrl: any
}

const SliderItemComponent = ({ item }: { item: SliderItem }) => (
    <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
            !item.id.startsWith('default') &&
            router.push(`/ItemDetail?id=${item.id}`)
        }
    >
        <View style={styles.imageContainer}>
            <Image
                source={
                    typeof item.imageUrl === 'string'
                        ? { uri: item.imageUrl }
                        : item.imageUrl
                }
                style={styles.image}
                resizeMode="cover"
            />
        </View>
    </TouchableOpacity>
)

interface SliderProps {
    data?: SliderItem[]
}

const Slider = ({ data }: SliderProps) => {
    const flatListRef = useRef<FlatList>(null)
    const [currentIndex, setCurrentIndex] = useState(0)

    const displayData = data && data.length > 0 ? data : defaultImages

    const scrollTo = (direction: 'next' | 'previous') => {
        const newIndex =
            direction === 'next' ? currentIndex + 1 : currentIndex - 1
        const isValidIndex = newIndex >= 0 && newIndex < displayData.length

        if (isValidIndex) {
            flatListRef.current?.scrollToIndex({
                index: newIndex,
                animated: true,
            })
            setCurrentIndex(newIndex)
        }
    }

    const renderNavButton = (
        direction: 'next' | 'previous',
        iconName: 'chevron-back' | 'chevron-forward',
        styleExtension: any
    ) => {
        const isDisabled =
            direction === 'previous'
                ? currentIndex === 0
                : currentIndex === displayData.length - 1

        return (
            <TouchableOpacity
                style={[styles.navButton, styleExtension]}
                onPress={() => scrollTo(direction)}
                disabled={isDisabled}
            >
                <Ionicons
                    name={iconName}
                    size={24}
                    color={isDisabled ? '#ccc' : '#fff'}
                />
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.carouselWrapper}>
                {/* Left Navigation Button */}
                {renderNavButton('previous', 'chevron-back', styles.leftButton)}

                {/* FlatList */}
                <FlatList
                    ref={flatListRef}
                    data={displayData}
                    renderItem={({ item }) => (
                        <SliderItemComponent item={item} />
                    )}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={ITEM_WIDTH + 20}
                    decelerationRate="fast"
                    contentContainerStyle={styles.listContainer}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(
                            event.nativeEvent.contentOffset.x /
                                (ITEM_WIDTH + 20)
                        )
                        setCurrentIndex(newIndex)
                    }}
                />

                {/* Right Navigation Button */}
                {renderNavButton('next', 'chevron-forward', styles.rightButton)}
            </View>
        </View>
    )
}

export default Slider

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    carouselWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    itemContainer: {
        width: ITEM_WIDTH,
        marginRight: -20,
        alignItems: 'center',
    },
    imageContainer: {
        width: ITEM_WIDTH - 60,
        height: ITEM_WIDTH - 10,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    navButton: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: 'grey',
        opacity: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    leftButton: {
        marginRight: -20,
        marginLeft: 20,
    },
    rightButton: {
        marginLeft: -20,
        marginRight: 20,
    },
})
