import React, { useEffect, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Button,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import pedidoService from "../../services/pedidoService";
import mercadoPagoService from "../../services/mercadoPagoService";

export default function DetallePedidoScreen({ route, navigation }) {

    const { idPedido } = route.params;

    const [pedido, setPedido] = useState(null);

    const [loading, setLoading] = useState(true);

    const [procesandoPago, setProcesandoPago] = useState(false);

    async function cargar() {

        const data = await pedidoService.obtener(idPedido);

        setPedido(data);

        setLoading(false);

    }

    async function pagarMercadoPago() {

        try {

            const preferencia = await mercadoPagoService.crearPreferencia(
                idPedido
            );

            const url = preferencia.sandboxInitPoint || preferencia.initPoint;
            if (!url) {
                throw new Error("Mercado Pago no devolvió una URL de pago.");
            }
            await Linking.openURL(url);

        } catch (error) {

            Alert.alert(
                "Error",
                error.response?.data?.message || "No se pudo crear el pago."
            );

        }

    }

    async function simularPagoMercadoPago() {

        try {

            setProcesandoPago(true);

            const resultado = await mercadoPagoService.simularAprobacion(
                idPedido
            );

            Alert.alert(
                "Pago aprobado",
                "El cobro de Mercado Pago fue simulado. La reserva ya estÃ¡ confirmada y su QR fue generado."
            );

            navigation.getParent()?.navigate("Reservas", {
                screen: "ReservaQR",
                params: {
                    idReserva: resultado.reserva.idReserva
                }
            });

        } catch (error) {

            Alert.alert(
                "Error",
                error.response?.data?.message || "No se pudo simular el cobro."
            );

        } finally {

            setProcesandoPago(false);

        }

    }

    useEffect(() => {

        cargar();

    }, []);

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>

            <Text style={styles.title}>
                Pedido #{pedido.idPedido}
            </Text>

            <Text style={styles.item}>
                Estado: {pedido.estado}
            </Text>

            <Text style={styles.item}>
                Total: ${pedido.total}
            </Text>

            <Text style={styles.subtitle}>
                Detalle
            </Text>

            {pedido.detalles.map((detalle) => (
                <View
                    key={detalle.idPedidoDetalle}
                    style={styles.detalle}
                >
                    <Text>
                        {detalle.producto}
                    </Text>

                    <Text>
                        {detalle.cantidad} x ${detalle.precioUnitario}
                    </Text>
                </View>
            ))}

            <View style={styles.separator} />

            {pedido.idReserva ? (
                <Button
                    title={procesandoPago ? "Procesando cobro..." : "Simular pago con Mercado Pago"}
                    onPress={simularPagoMercadoPago}
                    disabled={procesandoPago}
                />
            ) : (
                <Button
                    title="Pagar con Mercado Pago"
                    onPress={pagarMercadoPago}
                />
            )}

        </ScrollView>
    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#ffffff"
    },

    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 16
    },

    subtitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 12
    },

    item: {
        fontSize: 16,
        marginBottom: 8
    },

    detalle: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eeeeee"
    },

    separator: {
        height: 20
    }

});
