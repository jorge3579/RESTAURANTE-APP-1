import React from "react";

import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS, SHADOWS, SIZES } from "../constants/theme";

export default function InfoCard({ title, value, iconName, color = COLORS.primary }) {

    return (
        <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
                <MaterialCommunityIcons name={iconName} size={30} color={color} />
            </View>
            <View style={styles.content}>
                <Text style={styles.label}>{title}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        padding: 20,
        marginBottom: 15,
        flexDirection: "row",
        alignItems: "center",
        ...SHADOWS.medium
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15
    },
    content: {
        flex: 1
    },
    label: {
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: "600"
    },
    value: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.secondary,
        marginTop: 4
    }
});
