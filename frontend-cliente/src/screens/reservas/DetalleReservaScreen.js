import React, { useEffect, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import reservaService from "../../services/reservaService";
import ingresoQRService from "../../services/ingresoQRService";

export default function DetalleReservaScreen({ route, navigation }) {

    const { idReserva } = route.params;

    const [reserva, setReserva] = useState(null);

    const [loading, setLoading] = useState(true);

    async function cargar() {

        const data = await reservaService.obtener(idReserva);

        setReserva(data);

        setLoading(false);

    }

    async function generarQR() {

        try {

            const qr = await ingresoQRService.generar(idReserva);

            navigation.navigate("ReservaQR", {
                qr
            });

        } catch (error) {

            Alert.alert(
                "Error",
                "No se pudo generar el QR."
            );

        }

    }

    async function cancelar() {

        try {

            const data = await reservaService.cancelar(idReserva);

            setReserva(data);

            Alert.alert(
                "Reserva cancelada",
                "La reserva fue cancelada correctamente."
            );

        } catch (error) {

            Alert.alert(
                "Error",
                "No se pudo cancelar la reserva."
            );

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
                Reserva #{reserva.idReserva}
            </Text>

            <Text style={styles.item}>
                Fecha: {reserva.fechaReserva}
            </Text>

            <Text style={styles.item}>
                Hora: {reserva.horaReserva}
            </Text>

            <Text style={styles.item}>
                Sucursal: {reserva.sucursal}
            </Text>

            <Text style={styles.item}>
                Mesa: {reserva.mesa || "Asignada automáticamente"}
            </Text>

            <Text style={styles.item}>
                Personas: {reserva.cantidadPersonas}
            </Text>

            <Text style={styles.item}>
                Estado: {reserva.estado}
            </Text>

            <View style={styles.separator} />

            <Button
                title="Generar QR"
                onPress={generarQR}
            />

            <View style={styles.separator} />

            <Button
                title="Cancelar reserva"
                onPress={cancelar}
                color="#b00020"
            />

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
        marginBottom: 20
    },

    item: {
        fontSize: 16,
        marginBottom: 10
    },

    separator: {
        height: 18
    }

});