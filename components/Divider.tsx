// Divider.js
import React from 'react'
import { View, StyleSheet } from 'react-native'

const Divider = ({ color = '#ccc', height = 1, style }) => {
    return (
        <View
            style={[
                styles.divider,
                { backgroundColor: color, height: height },
                style,
            ]}
        />
    )
}

const styles = StyleSheet.create({
    divider: {
        width: 'auto',
        marginLeft: 16,
        marginRight: 16,
    },
})

export default Divider
