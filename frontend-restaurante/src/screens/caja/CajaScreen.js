import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from "react-native";

import cajaService from "../../services/cajaService";
import { COLORS, SIZES } from "../../constants/theme";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useSucursal } from "../../context/SucursalContext";

export default function CajaScreen() {
    const [cajas, setCajas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Formulario de apertura/cierre
    const { idSucursal } = useSucursal();
    const [monto, setMonto] = useState("");
    const [cajaAbierta, setCajaAbierta] = useState(null);

    async function cargar() {
        try {
            const datos = await cajaService.listar();
            const cajasSucursal = datos.filter((item) => Number(item.idSucursal) === Number(idSucursal));
            setCajas(cajasSucursal);
            // Buscar si hay una abierta para esta sucursal
            const abierta = cajasSucursal.find(c => c.estado === 'ABIERTA');
            setCajaAbierta(abierta);
        } catch (error) {
            console.error("Error al cargar cajas:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        cargar();
    }, [idSucursal]);

    async function handleApertura() {
        const montoNumerico = Number(monto.replace(",", "."));
        if (!monto.trim() || !Number.isFinite(montoNumerico) || montoNumerico < 0) {
            Alert.alert("Error", "Ingrese un monto inicial válido.");
            return;
        }
        try {
            await cajaService.abrir({
                idSucursal,
                montoInicial: montoNumerico,
                observaciones: "Apertura desde dispositivo móvil"
            });
            Alert.alert("Éxito", "Caja abierta correctamente.");
            setMonto("");
            cargar();
        } catch (error) {
            Alert.alert("Error", "No se pudo abrir la caja.");
        }
    }

    async function handleCierre() {
        const montoNumerico = Number(monto.replace(",", "."));
        if (!monto.trim() || !Number.isFinite(montoNumerico) || montoNumerico < 0) {
            Alert.alert("Error", "Ingrese un monto final válido.");
            return;
        }
        try {
            await cajaService.cerrar(cajaAbierta.idCaja, {
                montoFinal: montoNumerico,
                observaciones: "Cierre desde dispositivo móvil"
            });
            Alert.alert("Éxito", "Caja cerrada correctamente.");
            setMonto("");
            cargar();
        } catch (error) {
            Alert.alert("Error", "No se pudo cerrar la caja.");
        }
    }

    const renderCaja = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.idText}># {item.idCaja}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.estado === 'ABIERTA' ? COLORS.success : COLORS.error }]}>
                    <Text style={styles.statusText}>{item.estado}</Text>
                </View>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.cardText}>Sucursal: {item.sucursal}</Text>
                <Text style={styles.cardText}>Apertura: {new Date(item.fechaApertura).toLocaleDateString()}</Text>
                <View style={styles.moneyRow}>
                    <View>
                        <Text style={styles.moneyLabel}>Inicial</Text>
                        <Text style={styles.moneyVal}>${item.montoInicial}</Text>
                    </View>
                    {item.montoFinal !== null && item.montoFinal !== undefined && (
                        <View>
                            <Text style={styles.moneyLabel}>Final</Text>
                            <Text style={[styles.moneyVal, { color: COLORS.primary }]}>${item.montoFinal}</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary}/></View>;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.adminSection}>
                <Text style={styles.sectionTitle}>
                    {cajaAbierta ? "Gestión de Cierre" : "Apertura de Turno"}
                </Text>

                <CustomInput
                    label={cajaAbierta ? "Efectivo en Caja ($)" : "Monto de Apertura ($)"}
                    placeholder="0.00"
                    keyboardType="numeric"
                    iconName="cash-register"
                    value={monto}
                    onChangeText={setMonto}
                />

                <CustomButton
                    title={cajaAbierta ? "Cerrar Caja" : "Abrir Caja"}
                    onPress={cajaAbierta ? handleCierre : handleApertura}
                    style={cajaAbierta ? { backgroundColor: COLORS.error } : {}}
                    textStyle={cajaAbierta ? { color: COLORS.white } : {}}
                />
            </View>

            <View style={styles.historySection}>
                <Text style={styles.historyTitle}>Historial Reciente</Text>
                <FlatList
                    data={cajas}
                    keyExtractor={i => i.idCaja.toString()}
                    renderItem={renderCaja}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); cargar(); }} />}
                    ListEmptyComponent={<Text style={styles.empty}>No hay registros de caja.</Text>}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    adminSection: { padding: SIZES.padding, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    sectionTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.white, marginBottom: 15 },
    historySection: { flex: 1, padding: SIZES.padding },
    historyTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.textLight, marginBottom: 15 },
    list: { paddingBottom: 20 },
    card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 15, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
    idText: { fontWeight: "bold", color: COLORS.white },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    statusText: { color: COLORS.black, fontSize: 10, fontWeight: "bold" },
    cardBody: {},
    cardText: { color: COLORS.textLight, fontSize: 13 },
    moneyRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
    moneyLabel: { fontSize: 10, color: COLORS.textLight, textAlign: "center" },
    moneyVal: { fontSize: 16, fontWeight: "bold", color: COLORS.white },
    empty: { textAlign: "center", color: COLORS.textLight, marginTop: 30 }
});
