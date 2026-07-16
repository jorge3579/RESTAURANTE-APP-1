import React, { useEffect, useState } from "react";

import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import productoService from "../../services/productoService";
import { COLORS, SHADOWS, SIZES } from "../../constants/theme";
import { resolverProductoImagen } from "../../helpers/productoImagen";

export default function MenuScreen({ navigation }) {

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    async function cargar() {
        try {
            setLoading(true);
            const datos = await productoService.listar();
            setProductos(datos);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        cargar();
        const interval = setInterval(cargar, 30000);
        return () => clearInterval(interval);
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {!!item.imagenUrl && (
                <Image source={{ uri: resolverProductoImagen(item.imagenUrl) }} style={styles.productImage} />
            )}
            <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                    <Text style={styles.nombre}>{item.nombre}</Text>
                    <Text style={styles.descripcion} numberOfLines={2}>
                        {item.descripcion || "Sin descripción disponible"}
                    </Text>
                    <Text style={styles.precio}>${item.precio}</Text>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate("Pedidos", {
                        screen: "NuevoPedido",
                        initial: false,
                        params: { productoInicial: item }
                    })}
                >
                    <MaterialCommunityIcons name="plus" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Nuestro Menú</Text>
                <Text style={styles.subtitle}>Selecciona tus favoritos</Text>
            </View>
            <FlatList
                data={productos}
                keyExtractor={(item) => item.idProducto.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.empty}>No hay productos disponibles en este momento.</Text>
                }
            />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        padding: SIZES.padding,
        backgroundColor: COLORS.white,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.secondary
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 2
    },
    list: {
        padding: SIZES.padding,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        overflow: "hidden",
        marginBottom: 15,
        ...SHADOWS.medium
    },
    productImage: { width: "100%", height: 180, resizeMode: "cover" },
    cardContent: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 15 },
    textContainer: {
        flex: 1,
        paddingRight: 10
    },
    nombre: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.secondary
    },
    descripcion: {
        fontSize: 13,
        color: COLORS.textLight,
        marginVertical: 4
    },
    precio: {
        fontSize: 17,
        fontWeight: "bold",
        color: COLORS.primary,
        marginTop: 4
    },
    addButton: {
        backgroundColor: COLORS.primary,
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: "center",
        alignItems: "center",
        ...SHADOWS.light
    },
    empty: {
        textAlign: "center",
        color: COLORS.textLight,
        marginTop: 40,
        fontSize: 16
    }
});
