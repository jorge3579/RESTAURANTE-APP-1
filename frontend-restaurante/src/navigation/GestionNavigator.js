import React from "react";
import { TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import GestionMenuScreen from "../screens/gestion/GestionMenuScreen";
import ProductosListScreen from "../screens/gestion/ProductosListScreen";
import ProductoFormScreen from "../screens/gestion/ProductoFormScreen";
import PromocionesListScreen from "../screens/gestion/PromocionesListScreen";
import PromocionFormScreen from "../screens/gestion/PromocionFormScreen";
import CategoriasListScreen from "../screens/gestion/CategoriasListScreen";
import CategoriaFormScreen from "../screens/gestion/CategoriaFormScreen";
import { COLORS } from "../constants/theme";
import { useGlobalRefresh } from "../context/RefreshContext";

const Stack = createNativeStackNavigator();

export default function GestionNavigator() {
    const { refresh } = useGlobalRefresh();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: COLORS.background,
                },
                headerTintColor: COLORS.white,
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                contentStyle: {
                    backgroundColor: COLORS.background
                },
                headerRight: () => (
                    <TouchableOpacity
                        onPress={refresh}
                        accessibilityLabel="Actualizar pantalla"
                        style={{ paddingHorizontal: 8, paddingVertical: 8 }}
                    >
                        <MaterialCommunityIcons name="refresh" size={25} color={COLORS.primary} />
                    </TouchableOpacity>
                )
            }}
        >
            <Stack.Screen
                name="GestionHome"
                component={GestionMenuScreen}
                options={{ title: "Gestión de Local" }}
            />
            <Stack.Screen
                name="ProductosList"
                component={ProductosListScreen}
                options={{ title: "Mis Productos" }}
            />
            <Stack.Screen
                name="ProductoForm"
                component={ProductoFormScreen}
                options={({ route }) => ({
                    title: route.params?.producto ? "Editar Producto" : "Nuevo Producto"
                })}
            />
            <Stack.Screen
                name="PromocionesList"
                component={PromocionesListScreen}
                options={{ title: "Promociones" }}
            />
            <Stack.Screen
                name="PromocionForm"
                component={PromocionFormScreen}
                options={({ route }) => ({
                    title: route.params?.promocion ? "Editar Promo" : "Nueva Promo"
                })}
            />
            <Stack.Screen
                name="CategoriasList"
                component={CategoriasListScreen}
                options={{ title: "Categorías" }}
            />
            <Stack.Screen
                name="CategoriaForm"
                component={CategoriaFormScreen}
                options={({ route }) => ({
                    title: route.params?.categoria ? "Editar categoría" : "Nueva categoría"
                })}
            />
        </Stack.Navigator>
    );
}
