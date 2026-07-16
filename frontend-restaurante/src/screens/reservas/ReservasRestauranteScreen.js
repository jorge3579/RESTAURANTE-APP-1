import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import reservaService from "../../services/reservaService";
import socketService from "../../services/socketService";
import { useGlobalRefresh } from "../../context/RefreshContext";
import { useSucursal } from "../../context/SucursalContext";
import { COLORS, SIZES } from "../../constants/theme";

export default function ReservasRestauranteScreen() {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { refreshKey } = useGlobalRefresh();
    const { idSucursal } = useSucursal();

    const cargar = useCallback(async () => {
        try {
            const data = await reservaService.listar();
            setReservas(data.filter((item) => Number(item.idSucursal) === Number(idSucursal)));
        } catch {
            Alert.alert("Error", "No se pudieron cargar las reservas.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [idSucursal]);

    useEffect(() => {
        cargar();
        if (idSucursal) socketService.unirseSucursal(idSucursal);
        const dejar = socketService.escucharNuevaReserva(cargar);
        const interval = setInterval(cargar, 30000);
        return () => { dejar(); clearInterval(interval); };
    }, [cargar, refreshKey, idSucursal]);

    async function cambiar(item, accion, mensaje) {
        try {
            await reservaService[accion](item.idReserva);
            cargar();
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || mensaje);
        }
    }

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

    return (
        <FlatList
            style={styles.container}
            contentContainerStyle={styles.list}
            data={reservas}
            keyExtractor={(item) => String(item.idReserva)}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); cargar(); }} />}
            ListEmptyComponent={<Text style={styles.empty}>No hay reservas registradas.</Text>}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Reserva #{item.idReserva}</Text>
                        <Text style={styles.state}>{item.estado}</Text>
                    </View>
                    <Text style={styles.text}>{item.usuario || item.cliente || "Cliente"}</Text>
                    <Text style={styles.text}>{String(item.fechaReserva).slice(0, 10)} · {String(item.horaReserva).slice(0, 5)} · {item.cantidadPersonas} personas</Text>
                    {!!item.observaciones && <Text style={styles.note}>{item.observaciones}</Text>}
                    <View style={styles.actions}>
                        {item.estado === "PENDIENTE" && <Action label="Confirmar" onPress={() => cambiar(item, "confirmar", "No se pudo confirmar.")} />}
                        {item.estado === "CONFIRMADA" && <Action label="Finalizar" onPress={() => cambiar(item, "finalizar", "No se pudo finalizar.")} />}
                        {item.estado === "CONFIRMADA" && <Action label="No asistió" secondary onPress={() => cambiar(item, "noAsistio", "No se pudo actualizar.")} />}
                        {["PENDIENTE", "CONFIRMADA"].includes(item.estado) && <Action label="Cancelar" danger onPress={() => cambiar(item, "cancelar", "No se pudo cancelar.")} />}
                    </View>
                </View>
            )}
        />
    );
}

function Action({ label, onPress, danger, secondary }) {
    return <TouchableOpacity onPress={onPress} style={[styles.button, danger && styles.danger, secondary && styles.secondary]}><Text style={styles.buttonText}>{label}</Text></TouchableOpacity>;
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    list: { padding: SIZES.padding, paddingBottom: 30 },
    center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.background },
    empty: { textAlign: "center", color: COLORS.textLight, marginTop: 40 },
    card: { backgroundColor: COLORS.surface, padding: 16, borderRadius: SIZES.radius, marginBottom: 14, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    title: { color: COLORS.white, fontSize: 17, fontWeight: "bold" },
    state: { color: COLORS.primary, fontWeight: "bold", fontSize: 12 },
    text: { color: COLORS.textLight, marginTop: 6 },
    note: { color: COLORS.white, fontStyle: "italic", marginTop: 8 },
    actions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
    button: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 8 },
    danger: { backgroundColor: COLORS.error },
    secondary: { backgroundColor: "#666666" },
    buttonText: { color: COLORS.black, fontWeight: "bold" }
});
