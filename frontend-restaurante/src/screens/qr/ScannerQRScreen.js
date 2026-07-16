import React, { useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ingresoQRService from "../../services/ingresoQRService";
import { COLORS, SIZES } from "../../constants/theme";

export default function ScannerQRScreen() {
    const [scannerVisible, setScannerVisible] = useState(false);
    const [procesando, setProcesando] = useState(false);
    const [lecturas, setLecturas] = useState([]);

    async function abrirCamara() {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permiso requerido", "Debe autorizar la cámara para escanear códigos QR.");
            return;
        }
        setScannerVisible(true);
    }

    async function procesarLectura({ data }) {
        if (procesando) return;
        setProcesando(true);
        setScannerVisible(false);

        const lecturaBase = {
            id: `${Date.now()}-${data}`,
            codigo: data,
            fecha: new Date().toLocaleString()
        };

        try {
            const resultado = await ingresoQRService.validar(data);
            setLecturas((actuales) => [{ ...lecturaBase, valido: true, resultado }, ...actuales]);
            Alert.alert("Ingreso autorizado", `Reserva #${resultado.idReserva}`);
        } catch (error) {
            const mensaje = error.response?.data?.message || "El QR no es válido o ya fue utilizado.";
            setLecturas((actuales) => [{ ...lecturaBase, valido: false, mensaje }, ...actuales]);
            Alert.alert("QR rechazado", mensaje);
        } finally {
            setProcesando(false);
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.cameraButton} onPress={abrirCamara} disabled={procesando}>
                <MaterialCommunityIcons name="camera" size={30} color={COLORS.black} />
                <Text style={styles.cameraButtonText}>{procesando ? "Validando..." : "Abrir cámara"}</Text>
            </TouchableOpacity>

            <Text style={styles.title}>QR leídos</Text>
            <FlatList
                data={lecturas}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.empty}>Todavía no se escanearon códigos.</Text>}
                renderItem={({ item }) => (
                    <View style={[styles.result, { borderLeftColor: item.valido ? COLORS.success : COLORS.error }]}>
                        <Text style={styles.resultTitle}>{item.valido ? "INGRESO AUTORIZADO" : "QR RECHAZADO"}</Text>
                        <Text style={styles.resultText}>{item.fecha}</Text>
                        {item.resultado && <Text style={styles.resultText}>Reserva #{item.resultado.idReserva}</Text>}
                        {item.mensaje && <Text style={styles.resultText}>{item.mensaje}</Text>}
                    </View>
                )}
            />

            <Modal visible={scannerVisible} animationType="slide" onRequestClose={() => setScannerVisible(false)}>
                <View style={styles.scannerContainer}>
                    <BarCodeScanner
                        onBarCodeScanned={procesarLectura}
                        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.scanGuide} />
                    <TouchableOpacity style={styles.closeButton} onPress={() => setScannerVisible(false)}>
                        <MaterialCommunityIcons name="close" size={28} color={COLORS.white} />
                        <Text style={styles.closeText}>Cerrar cámara</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: SIZES.padding, backgroundColor: COLORS.background },
    cameraButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: SIZES.radius, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
    cameraButtonText: { color: COLORS.black, fontWeight: "bold", fontSize: 18 },
    title: { color: COLORS.text, fontSize: 22, fontWeight: "bold", marginVertical: 20 },
    empty: { color: COLORS.textLight, textAlign: "center", marginTop: 30 },
    result: { backgroundColor: COLORS.surface, padding: 16, borderRadius: SIZES.radius, marginBottom: 12, borderLeftWidth: 5 },
    resultTitle: { color: COLORS.text, fontWeight: "bold" },
    resultText: { color: COLORS.textLight, marginTop: 4 },
    scannerContainer: { flex: 1, backgroundColor: COLORS.black, justifyContent: "center", alignItems: "center" },
    scanGuide: { width: 260, height: 260, borderWidth: 3, borderColor: COLORS.primary, borderRadius: 20 },
    closeButton: { position: "absolute", bottom: 45, backgroundColor: "#000000AA", padding: 14, borderRadius: 30, flexDirection: "row", gap: 8, alignItems: "center" },
    closeText: { color: COLORS.white, fontWeight: "bold" }
});
