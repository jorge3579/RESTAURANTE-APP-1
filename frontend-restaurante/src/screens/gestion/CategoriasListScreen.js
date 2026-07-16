import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import productoService from "../../services/productoService";
import { COLORS, SIZES } from "../../constants/theme";

export default function CategoriasListScreen({ navigation }) {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargar = useCallback(async () => {
        try {
            const data = await productoService.listarCategorias();
            setCategorias(data.filter((item) => item.activa));
        } catch {
            Alert.alert("Error", "No se pudieron cargar las categorías.");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

    function confirmarEliminar(categoria) {
        Alert.alert("Eliminar categoría", `¿Eliminar ${categoria.nombre}?`, [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await productoService.eliminarCategoria(categoria.idCategoria);
                        cargar();
                    } catch (error) {
                        Alert.alert("No se pudo eliminar", error.response?.data?.message || "La categoría puede tener productos asociados.");
                    }
                }
            }
        ]);
    }

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

    return (
        <View style={styles.container}>
            <FlatList
                data={categorias}
                keyExtractor={(item) => String(item.idCategoria)}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.empty}>No hay categorías cargadas.</Text>}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.info}>
                            <Text style={styles.name}>{item.nombre}</Text>
                            {!!item.descripcion && <Text style={styles.description}>{item.descripcion}</Text>}
                        </View>
                        <TouchableOpacity accessibilityLabel="Editar categoría" onPress={() => navigation.navigate("CategoriaForm", { categoria: item })} style={styles.action}>
                            <MaterialCommunityIcons name="pencil" size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity accessibilityLabel="Eliminar categoría" onPress={() => confirmarEliminar(item)} style={styles.action}>
                            <MaterialCommunityIcons name="delete-outline" size={24} color={COLORS.error} />
                        </TouchableOpacity>
                    </View>
                )}
            />
            <TouchableOpacity accessibilityLabel="Nueva categoría" style={styles.fab} onPress={() => navigation.navigate("CategoriaForm")}>
                <MaterialCommunityIcons name="plus" size={30} color={COLORS.black} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.background },
    list: { padding: SIZES.padding, paddingBottom: 90 },
    card: { flexDirection: "row", alignItems: "center", padding: 16, marginBottom: 12, borderRadius: SIZES.radius, backgroundColor: COLORS.surface },
    info: { flex: 1 },
    name: { color: COLORS.white, fontSize: 17, fontWeight: "bold" },
    description: { color: COLORS.textLight, marginTop: 3 },
    action: { padding: 8 },
    empty: { color: COLORS.textLight, textAlign: "center", marginTop: 40 },
    fab: { position: "absolute", right: 22, bottom: 22, width: 58, height: 58, borderRadius: 29, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.primary }
});
