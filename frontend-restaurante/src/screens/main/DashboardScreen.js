import React, { useEffect, useState } from "react";

import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import dashboardService from "../../services/dashboardService";
import socketService from "../../services/socketService";
import { useGlobalRefresh } from "../../context/RefreshContext";
import { useSucursal } from "../../context/SucursalContext";

export default function DashboardScreen({ navigation }) {

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);
    const { refreshKey } = useGlobalRefresh();
    const { idSucursal } = useSucursal();

    async function cargar() {

        const resumen = await dashboardService.resumen();

        setData(resumen);

        setLoading(false);

        setRefreshing(false);

    }

    useEffect(() => {

        cargar();

        if (idSucursal) socketService.unirseSucursal(idSucursal);
        const dejarPedidos = socketService.escucharNuevoPedido(cargar);
        const dejarReservas = socketService.escucharNuevaReserva(cargar);

        const interval = setInterval(cargar, 30000);
        return () => {
            clearInterval(interval);
            dejarPedidos();
            dejarReservas();
        };
    }, [refreshKey, idSucursal]);

    if (loading) {

        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" />
            </View>
        );

    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        cargar();
                    }}
                />
            }
        >
            <Text style={styles.title}>
                Dashboard
            </Text>

            <View style={styles.card}>
                <Text>Reservas hoy</Text>
                <Text style={styles.value}>
                    {data.resumenGeneral.reservasHoy}
                </Text>
                <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate("ReservasLocal")}>
                    <Text style={styles.linkText}>Ver y gestionar reservas</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text>Pedidos hoy</Text>
                <Text style={styles.value}>
                    {data.resumenGeneral.pedidosHoy}
                </Text>
            </View>

            <View style={styles.card}>
                <Text>Ventas hoy</Text>
                <Text style={styles.value}>
                    ${data.resumenGeneral.ventasHoy}
                </Text>
            </View>

            <View style={styles.card}>
                <Text>Mesas ocupadas</Text>
                <Text style={styles.value}>
                    {data.resumenGeneral.mesasOcupadas}
                </Text>
            </View>

            <View style={styles.card}>
                <Text>Mesas libres</Text>
                <Text style={styles.value}>
                    {data.resumenGeneral.mesasLibres}
                </Text>
            </View>
        </ScrollView>
    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5"
    },

    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 18
    },

    card: {
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 10,
        marginBottom: 12
    },

    value: {
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 8
    },

    linkButton: { marginTop: 12, backgroundColor: "#1976D2", padding: 10, borderRadius: 8 },
    linkText: { color: "#ffffff", fontWeight: "bold", textAlign: "center" }

});
