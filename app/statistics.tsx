import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
    ScrollView,
    Text,
    View,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    ImageBackground,
} from 'react-native'
import { BarChart, PieChart } from 'react-native-chart-kit'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { apiService } from '../src/services/api'
import { CLOTHING_CATEGORIES } from '../src/lib/constants'

const screenWidth = Dimensions.get('window').width

// it is better to define the interface here for type safty reason
interface ClothingItem {
    id: string
    category?: string
    tags?: string[]
}

export default function StatisticsScreen() {
    const [clothes, setClothes] = useState<ClothingItem[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        loadClothes()
    }, [])

    const loadClothes = async () => {
        try {
            const data = await apiService.getClothes()
            setClothes(data)
            setLoading(false)
        } catch (error) {
            console.error('Error loading clothes:', error)
            setLoading(false)
        }
    }

    const getCategoryCounts = () => {
        const categories = Object.values(CLOTHING_CATEGORIES)
        const counts: { [key: string]: number } = {}

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

    const getTagCounts = () => {
        let withTags = 0
        let withoutTags = 0

        clothes.forEach((item) => {
            const hasResellOrDonate = item.tags?.some(
                (tag) =>
                    tag.toLowerCase() === 'resell' ||
                    tag.toLowerCase() === 'donate'
            )

            if (hasResellOrDonate) {
                withTags++
            } else {
                withoutTags++
            }
        })

        return { withTags, withoutTags }
    }

    // Format Y-axis labels to show only integers
    const formatYLabel = (value: string) => {
        const num = parseFloat(value)
        // Only show integer values, hide decimals like 0.5, 1.5
        if (num % 1 === 0) {
            return Math.floor(num).toString()
        }
        return ''
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.content}>
                        <Text style={styles.title}>Loading...</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

    const categoryCounts = getCategoryCounts()
    const categories = Object.values(CLOTHING_CATEGORIES)
    const tagCounts = getTagCounts()

    // shorter labels for display purpose
    const labelMap: { [key: string]: string } = {
        tops: 'Top',
        bottoms: 'Bottom',
        dresses: 'Dress',
        outerwear: 'Outer',
        shoes: 'Shoe',
        handbags: 'Bag',
        activewear: 'Sport',
        accessories: 'Acc',
    }

    // include ALL categories
    const allLabels = categories.map(
        (category) =>
            labelMap[category] ||
            category.charAt(0).toUpperCase() + category.slice(1)
    )
    const allValues = categories.map((category) => categoryCounts[category])

    // Bar chart data
    const barData = {
        labels: allLabels,
        datasets: [
            {
                data: allValues,
            },
        ],
    }

    // Pie chart data for resell/donate tags
    const pieData = [
        {
            name: 'Resell/Donate',
            population: tagCounts.withTags,
            color: 'green',
            legendFontColor: '#ffffff',
            legendFontSize: 12,
        },
        {
            name: 'Others',
            population: tagCounts.withoutTags,
            color: 'rgba(54, 162, 235, 0.6)',
            legendFontColor: '#ffffff',
            legendFontSize: 12,
        },
    ]

    return (
        <ImageBackground
            source={require('../assets/analysis.jpg')}
            style={styles.backgroundImage}
            resizeMode="stretch"
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={styles.subHeader}></View>
                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View>
                        <Text style={styles.chartTitle}>
                            Items By Categories
                        </Text>
                    </View>
                    <View style={styles.content}>
                        {/* Bar Chart for Category Counts */}
                        <BarChart
                            data={barData}
                            width={screenWidth - 20}
                            height={320}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={{
                                backgroundColor: 'transparent',
                                backgroundGradientFrom: 'transparent',
                                backgroundGradientTo: 'transparent',
                                color: () => 'rgba(75, 192, 192, 1)',
                                labelColor: () => 'rgba(255, 255, 255, 1)',
                                strokeWidth: 1,
                                barPercentage: 0.7,
                                useShadowColorFromDataset: false,
                                formatYLabel: formatYLabel,
                                propsForLabels: {
                                    fontSize: 9,
                                },
                            }}
                            verticalLabelRotation={25}
                            style={styles.chart}
                            showValuesOnTopOfBars={true}
                        />
                    </View>

                    <View style={styles.pieChartContainer}>
                        <Text style={styles.pieChartTitle}>
                            Items with Resell/Donate Tags
                        </Text>
                        {/* Pie Chart for tads classification counts */}
                        <PieChart
                            data={pieData}
                            width={screenWidth - 30}
                            height={180}
                            chartConfig={{
                                backgroundColor: 'transparent',
                                backgroundGradientFrom: 'transparent',
                                backgroundGradientTo: 'transparent',
                                color: () => 'rgba(255, 255, 255, 1)',
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            center={[10, 0]}
                            absolute
                        />
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    subHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 70,
    },
    backButton: {
        padding: 5,
        marginRight: 15,
        color: 'white',
        marginVertical: -20,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 10,
    },
    title: {
        fontSize: 22,
        marginBottom: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    chartTitle: {
        marginVertical: 60,
        color: 'grey',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'light',
        fontStyle: 'italic',
    },
    chart: {
        marginVertical: -60,
        borderRadius: 8,
        alignSelf: 'center',
        marginLeft: -35,
    },
    emptyChart: {
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 16,
        marginVertical: 0,
    },
    emptyText: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    pieChartContainer: {
        alignItems: 'center',
        marginVertical: 40,
        paddingHorizontal: 10,
    },
    pieChartTitle: {
        fontSize: 16,
        fontWeight: 'light',
        color: 'grey',
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 0,
    },
})
