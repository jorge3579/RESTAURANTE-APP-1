import React, { useEffect, useState } from "react";

import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";

import dashboardService from "../../services/dashboardService";
import pedidoService from "../../services/pedidoService";
import fidelizacionService from "../../services/fidelizacionService";
import promocionService from "../../services/promocionService";
import { COLORS, SIZES } from "../../constants/theme";
import InfoCard from "../../components/InfoCard";

export default function HomeScreen() {

    const [dashboard, setDashboard] = useState(null);
    const [pedidosActivos, setPedidosActivos] = useState(0);
    const [puntos, setPuntos] = useState(0);
    const [promocion, setPromocion] = useState(null);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    async function cargarDashboard() {

        try {

            const [data, pedidos, datosPuntos, promociones] = await Promise.all([
                dashboardService.obtenerDashboard(),
                pedidoService.listar(),
                fidelizacionService.misPuntos(),
                promocionService.listarActivas()
            ]);

            setDashboard(data);
            setPedidosActivos(pedidos.filter((item) => !["ENTREGADO", "FINALIZADO", "CANCELADO"].includes(item.estado)).length);
            setPuntos(datosPuntos?.puntos ?? 0);
            setPromocion(promociones[0] || null);

        } catch (error) {
            console.error("Error al cargar dashboard:", error);
        } finally {

            setLoading(false);

            setRefreshing(false);

        }

    }

    useEffect(() => {

        cargarDashboard();

    }, []);

    if (loading) {

        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Cargando delicias...</Text>
            </View>
        );

    }

    return (

        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        cargarDashboard();
                    }}
                    colors={[COLORS.primary]}
                />
            }
        >
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <View style={styles.header}>
                <Text style={styles.greeting}>¡Hola!</Text>
                <Text style={styles.title}>¿Qué vas a comer hoy?</Text>
            </View>

            <View style={styles.grid}>
                <InfoCard
                    title="Mis Pedidos"
                    value={pedidosActivos}
                    iconName="food"
                    color={COLORS.primary}
                />

                <InfoCard
                    title="Puntos acumulados"
                    value={`${puntos} pts`}
                    iconName="ticket-percent"
                    color={COLORS.accent}
                />

                <InfoCard
                    title="Mesas Disponibles"
                    value={dashboard?.mesasLibres ?? 0}
                    iconName="table-chair"
                    color="#2196F3"
                />

                <View style={styles.promoBanner}>
                    <Text style={styles.promoTitle}>{promocion?.nombre || "Sin promociones activas"}</Text>
                    <Text style={styles.promoDesc}>
                        {promocion?.descripcion || "Revisa nuevamente más tarde."}
                    </Text>
                </View>
            </View>
        </ScrollView>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background
    },

    loadingText: {
        marginTop: 10,
        color: COLORS.textLight,
        fontSize: 16
    },

    header: {
        paddingHorizontal: SIZES.padding,
        paddingTop: 30,
        paddingBottom: 20
    },

    greeting: {
        fontSize: 18,
        color: COLORS.textLight,
        fontWeight: "400"
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.secondary,
        marginTop: 5
    },

    grid: {
        paddingHorizontal: SIZES.padding,
    },

    promoBanner: {
        backgroundColor: COLORS.secondary,
        borderRadius: SIZES.radius,
        padding: 20,
        marginTop: 10,
        marginBottom: 30
    },

    promoTitle: {
        color: COLORS.accent,
        fontSize: 18,
        fontWeight: "bold"
    },

    promoDesc: {
        color: COLORS.white,
        fontSize: 14,
        marginTop: 5,
        opacity: 0.9
    }

});
