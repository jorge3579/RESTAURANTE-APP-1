import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import pedidoService from "../../services/pedidoService";
import socketService from "../../services/socketService";
import { useGlobalRefresh } from "../../context/RefreshContext";
import { useSucursal } from "../../context/SucursalContext";
import { COLORS, SHADOWS, SIZES } from "../../constants/theme";
import CustomButton from "../../components/CustomButton";

export default function PedidosRestauranteScreen() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { refreshKey } = useGlobalRefresh();
    const { idSucursal } = useSucursal();

    async function cargar() {
        try {
            const datos = await pedidoService.listar();
            setPedidos(datos.filter((item) => Number(item.idSucursal) === Number(idSucursal)));
        } catch (error) {
            Alert.alert("Error", "No se pudieron actualizar los pedidos.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        cargar();
        if (idSucursal) socketService.unirseSucursal(idSucursal);
        const dejarDeEscuchar = socketService.escucharNuevoPedido(cargar);
        const interval = setInterval(cargar, 30000);
        return () => {
            clearInterval(interval);
            dejarDeEscuchar();
        };
    }, [refreshKey, idSucursal]);

    async function cambiarEstado(idPedido, estado) {
        try {
            await pedidoService.cambiarEstado(idPedido, estado);
            cargar();
        } catch (error) {
            Alert.alert("Error", "No se pudo cambiar el estado del pedido.");
        }
    }

    const renderPedido = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.orderId}>Pedido #{item.idPedido}</Text>
                    <Text style={styles.orderDate}>{new Date(item.fechaCreacion).toLocaleTimeString()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado) }]}>
                    <Text style={styles.statusText}>{item.estado}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <Text style={styles.clientName}>{item.cliente || "Cliente Final"}</Text>
                <Text style={styles.details}>Mesa: {item.mesa || "Para llevar"} • {item.tipoConsumo}</Text>

                {/* Aquí se podrían listar los items si el backend los enviara en el listar o si hiciéramos un fetch por cada uno */}
                <Text style={styles.total}>Total: ${item.total}</Text>
            </View>

            <View style={styles.actions}>
                {["CREADO", "PAGADO", "CONFIRMADO"].includes(item.estado) && (
                    <CustomButton
                        title="Enviar a Cocina"
                        onPress={() => cambiarEstado(item.idPedido, "EN_COCINA")}
                        style={styles.actionBtn}
                        textStyle={styles.actionBtnText}
                    />
                )}
                {item.estado === "EN_COCINA" && (
                    <CustomButton
                        title="Listo para Entregar"
                        onPress={() => cambiarEstado(item.idPedido, "LISTO")}
                        style={[styles.actionBtn, { backgroundColor: COLORS.success }]}
                        textStyle={styles.actionBtnText}
                    />
                )}
                {item.estado === "LISTO" && (
                    <CustomButton
                        title="Marcar Entregado"
                        onPress={() => cambiarEstado(item.idPedido, "ENTREGADO")}
                        style={[styles.actionBtn, { backgroundColor: COLORS.secondary }]}
                        textStyle={styles.actionBtnText}
                    />
                )}
            </View>
        </View>
    );

    function getStatusColor(estado) {
        switch (estado) {
            case "CREADO":
            case "PENDIENTE_PAGO": return COLORS.primary;
            case "PAGADO":
            case "CONFIRMADO": return COLORS.success;
            case "EN_COCINA": return "#FF9800";
            case "LISTO": return COLORS.success;
            case "ENTREGADO": return COLORS.textLight;
            default: return COLORS.border;
        }
    }

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary}/></View>;

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={pedidos}
                keyExtractor={(item) => item.idPedido.toString()}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            cargar();
                        }}
                    />
                }
                ListEmptyComponent={<Text style={styles.empty}>No hay pedidos activos.</Text>}
                renderItem={renderPedido}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    list: { padding: SIZES.padding },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    empty: { textAlign: "center", marginTop: 50, color: COLORS.textLight, fontSize: 16 },
    card: { backgroundColor: COLORS.surface, borderRadius: SIZES.radius, padding: 15, marginBottom: 15, ...SHADOWS.medium },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
    orderId: { fontSize: 18, fontWeight: "bold", color: COLORS.white },
    orderDate: { fontSize: 12, color: COLORS.textLight },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    statusText: { color: COLORS.white, fontSize: 11, fontWeight: "bold" },
    cardBody: { marginBottom: 15 },
    clientName: { fontSize: 16, fontWeight: "bold", color: COLORS.white },
    details: { fontSize: 14, color: COLORS.textLight, marginTop: 2 },
    total: { fontSize: 18, fontWeight: "bold", color: COLORS.primary, marginTop: 8 },
    actions: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12 },
    actionBtn: { height: 45, marginVertical: 0 },
    actionBtnText: { fontSize: 14 }
});
