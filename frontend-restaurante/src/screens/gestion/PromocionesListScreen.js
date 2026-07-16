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

import promocionService from "../../services/promocionService";
import { COLORS, SHADOWS, SIZES } from "../../constants/theme";

export default function PromocionesListScreen({ navigation }) {

    const [promociones, setPromociones] = useState([]);
    const [loading, setLoading] = useState(true);

    async function cargarPromociones() {
        try {
            setLoading(true);
            const data = await promocionService.listar();
            setPromociones(data);
        } catch (error) {
            Alert.alert("Error", "No se pudieron cargar las promociones.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            cargarPromociones();
        });
        return unsubscribe;
    }, [navigation]);

    const renderPromocion = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.info}>
                    <Text style={styles.nombre}>{item.nombre}</Text>
                    <Text style={styles.descripcion}>{item.descripcion}</Text>
                    <View style={styles.discountRow}>
                        <MaterialCommunityIcons name="ticket-percent" size={16} color={COLORS.accent} />
                        <Text style={styles.descuento}>{item.valor}% OFF</Text>
                    </View>
                </View>
                <View style={styles.actions}>
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: item.activa ? COLORS.success + "20" : COLORS.error + "20" }
                    ]}>
                        <Text style={{ color: item.activa ? COLORS.success : COLORS.error, fontSize: 12, fontWeight: "bold" }}>
                            {item.activa ? "ACTIVA" : "EXPIRADA"}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("PromocionForm", { promocion: item })}
                        style={styles.iconButton}
                    >
                        <MaterialCommunityIcons name="pencil" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
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
                    data={promociones}
                    keyExtractor={(item) => item.idPromocion.toString()}
                    renderItem={renderPromocion}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.empty}>No hay promociones activas.</Text>
                    }
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate("PromocionForm")}
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
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
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
    descripcion: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 2
    },
    discountRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5
    },
    descuento: {
        fontSize: 16,
        color: COLORS.accent,
        fontWeight: "bold",
        marginLeft: 5
    },
    actions: {
        alignItems: "flex-end"
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
        marginBottom: 10
    },
    iconButton: {
        padding: 8,
        backgroundColor: "#333",
        borderRadius: 8
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
