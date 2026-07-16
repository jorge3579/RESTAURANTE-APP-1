import React from "react";

import { StyleSheet, Text, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS, SIZES } from "../constants/theme";

export default function CustomInput({
    label,
    iconName,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = "default",
    autoCapitalize = "none",
    error = null
}) {

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error && styles.inputError]}>
                {iconName && (
                    <MaterialCommunityIcons
                        name={iconName}
                        size={20}
                        color={COLORS.textLight}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.textLight}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        width: "100%"
    },
    label: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 5,
        fontWeight: "600"
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius,
        paddingHorizontal: 15,
        height: 55,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    icon: {
        marginRight: 10
    },
    input: {
        flex: 1,
        color: COLORS.text,
        fontSize: 16
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5
    }
});
