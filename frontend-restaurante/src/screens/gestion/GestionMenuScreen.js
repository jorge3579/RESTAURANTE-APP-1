import React from "react";

import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS, SHADOWS, SIZES } from "../../constants/theme";

const GestionItem = ({ title, subtitle, icon, onPress, color }) => (
    <TouchableOpacity
        style={styles.item}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
            <MaterialCommunityIcons name={icon} size={30} color={color} />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.itemTitle}>{title}</Text>
            <Text style={styles.itemSubtitle}>{subtitle}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textLight} />
    </TouchableOpacity>
);

export default function GestionMenuScreen({ navigation }) {

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>Gestión de Carta</Text>
                <Text style={styles.subtitle}>Configura tus productos y ofertas</Text>
            </View>

            <View style={styles.list}>
                <GestionItem
                    title="Productos"
                    subtitle="Administrar el menú completo"
                    icon="food-burger"
                    color="#FF5722"
                    onPress={() => navigation.navigate("ProductosList")}
                />

                <GestionItem
                    title="Promociones"
                    subtitle="Crear y editar ofertas flash"
                    icon="tag-multiple"
                    color="#FFC107"
                    onPress={() => navigation.navigate("PromocionesList")}
                />

                <GestionItem
                    title="Categorías"
                    subtitle="Organizar por grupos (Combos, Bebidas)"
                    icon="format-list-bulleted"
                    color="#4CAF50"
                    onPress={() => navigation.navigate("CategoriasList")}
                />

                <GestionItem
                    title="Ajustes de Local"
                    subtitle="Horarios y estados de sucursal"
                    icon="store-cog"
                    color="#2196F3"
                    onPress={() => navigation.getParent()?.navigate("Perfil")}
                />
            </View>
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    content: {
        padding: SIZES.padding
    },
    header: {
        marginBottom: 30,
        marginTop: 10
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.white
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        marginTop: 5
    },
    list: {
        gap: 15
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.surface,
        padding: 15,
        borderRadius: SIZES.radius,
        ...SHADOWS.medium
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15
    },
    textContainer: {
        flex: 1
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.white
    },
    itemSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 2
    }
});
