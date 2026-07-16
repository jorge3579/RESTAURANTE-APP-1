import React, { useEffect, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import productoService from "../../services/productoService";
import { COLORS, SHADOWS, SIZES } from "../../constants/theme";

export default function ProductosListScreen({ navigation }) {

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    async function cargarProductos() {
        try {
            setLoading(true);
            const data = await productoService.listar();
            setProductos(data.filter((item) => item.activo));
        } catch (error) {
            Alert.alert("Error", "No se pudieron cargar los productos.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            cargarProductos();
        });
        return unsubscribe;
    }, [navigation]);

    async function toggleDisponibilidad(producto) {
        try {
            const nuevoEstado = !producto.disponible;
            await productoService.actualizar(producto.idProducto, {
                ...producto,
                disponible: nuevoEstado
            });
            cargarProductos();
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar el estado.");
        }
    }

    const renderProducto = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.info}>
                    <Text style={styles.nombre}>{item.nombre}</Text>
                    <Text style={styles.categoria}>{item.categoria}</Text>
                    <Text style={styles.precio}>${item.precio}</Text>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity
                        onPress={() => toggleDisponibilidad(item)}
                        style={[
                            styles.statusBadge,
                            { backgroundColor: item.disponible ? COLORS.success + "20" : COLORS.error + "20" }
                        ]}
                    >
                        <Text style={{ color: item.disponible ? COLORS.success : COLORS.error, fontWeight: "bold" }}>
                            {item.disponible ? "ACTIVO" : "PAUSADO"}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.buttonsRow}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("ProductoForm", { producto: item })}
                            style={styles.iconButton}
                        >
                            <MaterialCommunityIcons name="pencil" size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
            ) : (
                <FlatList
                    data={productos}
                    keyExtractor={(item) => item.idProducto.toString()}
                    renderItem={renderProducto}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.empty}>No hay productos registrados.</Text>
                    }
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate("ProductoForm")}
            >
                <MaterialCommunityIcons name="plus" size={30} color={COLORS.black} />
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    loader: {
        flex: 1
    },
    list: {
        padding: SIZES.padding,
        paddingBottom: 100
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        marginBottom: 15,
        padding: 15,
        ...SHADOWS.medium
    },
    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    info: {
        flex: 1
    },
    nombre: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.white
    },
    categoria: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 2
    },
    precio: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: "bold",
        marginTop: 5
    },
    actions: {
        alignItems: "flex-end"
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginBottom: 10
    },
    buttonsRow: {
        flexDirection: "row"
    },
    iconButton: {
        padding: 8,
        backgroundColor: "#333",
        borderRadius: 8,
        marginLeft: 10
    },
    fab: {
        position: "absolute",
        bottom: 30,
        right: 30,
        backgroundColor: COLORS.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        ...SHADOWS.medium
    },
    empty: {
        textAlign: "center",
        color: COLORS.textLight,
        marginTop: 50,
        fontSize: 16
    }
});
