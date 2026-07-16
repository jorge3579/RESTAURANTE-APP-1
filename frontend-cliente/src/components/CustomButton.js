import React from "react";

import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

import { COLORS, SIZES } from "../constants/theme";

export default function CustomButton({
    title,
    onPress,
    loading = false,
    variant = "primary",
    style = {},
    textStyle = {},
    disabled = false
}) {

    const isPrimary = variant === "primary";

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[
                styles.button,
                isPrimary ? styles.primary : styles.secondary,
                disabled && styles.disabled,
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary ? COLORS.white : COLORS.primary} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        isPrimary ? styles.textPrimary : styles.textSecondary,
                        textStyle
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );

}

const styles = StyleSheet.create({
    button: {
        height: 55,
        borderRadius: SIZES.radius,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginVertical: 10
    },
    primary: {
        backgroundColor: COLORS.primary,
    },
    secondary: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    disabled: {
        backgroundColor: "#CCC",
        borderColor: "#CCC"
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
    },
    textPrimary: {
        color: COLORS.white,
    },
    textSecondary: {
        color: COLORS.primary,
    }
});
