import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import comandaService from "../../services/comandaService";
import socketService from "../../services/socketService";
import { useGlobalRefresh } from "../../context/RefreshContext";
import { useSucursal } from "../../context/SucursalContext";
import { COLORS, SHADOWS, SIZES } from "../../constants/theme";
import CustomButton from "../../components/CustomButton";

export default function CocinaScreen() {
    const [comandas, setComandas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { refreshKey } = useGlobalRefresh();

    const { idSucursal } = useSucursal();

    async function cargar() {
        if (!idSucursal) return;
        try {
            const datos = await comandaService.listarPorSucursal(idSucursal);
            setComandas(datos);
        } catch (error) {
            console.error("Error al cargar comandas:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    async function cambiarEstado(idComanda, estado) {
        try {
            await comandaService.cambiarEstado(idComanda, estado);
            cargar();
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar el estado de la comanda.");
        }
    }

    useEffect(() => {
        cargar();
        socketService.conectar();
        socketService.unirseSucursal(idSucursal);

        const dejarNuevas = socketService.escucharNuevaComanda(cargar);
        const dejarEstados = socketService.escucharCambioEstadoComanda(cargar);

        const interval = setInterval(cargar, 30000);
        return () => {
            clearInterval(interval);
            dejarNuevas();
            dejarEstados();
        };
    }, [refreshKey, idSucursal]);

    const renderComanda = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <Text style={styles.idText}># {item.idComanda}</Text>
                    <Text style={styles.orderRef}>Pedido: {item.idPedido}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: getBadgeColor(item.estado) }]}>
                    <Text style={styles.badgeText}>{item.estado}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                {/* Detalles de la comanda (items) irían aquí si el servicio los devuelve */}
                <Text style={styles.obsText}>{item.observaciones || "Sin observaciones especiales"}</Text>
                <View style={styles.timeRow}>
                    <MaterialCommunityIcons name="clock-fast" size={20} color={COLORS.primary} />
                    <Text style={styles.timeText}>{item.tiempoEstimadoMinutos || 15} min estimados</Text>
                </View>
            </View>

            <View style={styles.actions}>
                {item.estado === "PENDIENTE" && (
                    <CustomButton
                        title="Empezar a Preparar"
                        onPress={() => cambiarEstado(item.idComanda, "EN_PREPARACION")}
                    />
                )}
                {item.estado === "EN_PREPARACION" && (
                    <CustomButton
                        title="Marcar como LISTA"
                        onPress={() => cambiarEstado(item.idComanda, "LISTA")}
                        style={{ backgroundColor: COLORS.success }}
                        textStyle={{ color: COLORS.white }}
                    />
                )}
                {item.estado === "LISTA" && (
                    <CustomButton
                        title="Entregar a Cliente"
                        onPress={() => cambiarEstado(item.idComanda, "ENTREGADA")}
                        variant="secondary"
                    />
                )}
            </View>
        </View>
    );

    function getBadgeColor(estado) {
        switch (estado) {
            case 'PENDIENTE': return COLORS.primary;
            case 'EN_PREPARACION': return '#FF9800';
            case 'LISTA': return COLORS.success;
            default: return COLORS.border;
        }
    }

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary}/></View>;

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={comandas}
                keyExtractor={(item) => item.idComanda.toString()}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); cargar(); }} />
                }
                ListEmptyComponent={<Text style={styles.empty}>No hay tareas pendientes en cocina.</Text>}
                renderItem={renderComanda}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    list: { padding: SIZES.padding },
    empty: { textAlign: "center", marginTop: 50, color: COLORS.textLight, fontSize: 16 },
    card: { backgroundColor: COLORS.surface, borderRadius: 15, padding: 20, marginBottom: 15, ...SHADOWS.medium },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
    headerLeft: { flex: 1 },
    idText: { fontSize: 20, fontWeight: "bold", color: COLORS.white },
    orderRef: { fontSize: 13, color: COLORS.textLight },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    badgeText: { color: COLORS.black, fontSize: 12, fontWeight: "bold" },
    cardBody: { marginBottom: 20 },
    obsText: { color: COLORS.white, fontStyle: "italic", marginBottom: 10 },
    timeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    timeText: { color: COLORS.primary, fontWeight: "bold" },
    actions: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 15 }
});
