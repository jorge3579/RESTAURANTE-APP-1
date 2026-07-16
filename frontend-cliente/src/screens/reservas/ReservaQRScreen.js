import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    View
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import httpClient from "../../services/httpClient";
import { COLORS, SIZES } from "../../constants/theme";

export default function ReservaQRScreen({ route }) {
    const { idReserva } = route.params;
    const [qr, setQr] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function obtenerQR() {
            try {
                // Intentamos obtener el QR de la reserva
                const response = await httpClient.post(`/ingresos-qr/reserva/${idReserva}/generar`);
                setQr(response.data.data);
            } catch (error) {
                Alert.alert("Error", "No se pudo generar el código QR de ingreso.");
            } finally {
                setLoading(false);
            }
        }
        obtenerQR();
    }, [idReserva]);

    if (loading) return <View style={styles.container}><ActivityIndicator size="large" color={COLORS.primary}/></View>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tu pase de entrada</Text>

            <View style={styles.qrContainer}>
                {qr && (
                    <QRCode
                        value={qr.codigoQR}
                        size={220}
                        color={COLORS.secondary}
                        backgroundColor={COLORS.white}
                    />
                )}
            </View>

            <Text style={styles.codigo}>ID: {qr?.codigoQR}</Text>

            <View style={styles.infoBox}>
                <Text style={styles.info}>
                    Muestra este código al personal del restaurante para validar tu ingreso.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: COLORS.background
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
        color: COLORS.secondary
    },
    qrContainer: {
        padding: 20,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    codigo: {
        marginTop: 20,
        fontSize: 10,
        color: COLORS.textLight,
        textAlign: "center"
    },
    infoBox: {
        marginTop: 40,
        padding: 20,
        backgroundColor: COLORS.primary + "10",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: COLORS.primary + "30"
    },
    info: {
        fontSize: 16,
        textAlign: "center",
        color: COLORS.secondary,
        lineHeight: 24
    }
});
