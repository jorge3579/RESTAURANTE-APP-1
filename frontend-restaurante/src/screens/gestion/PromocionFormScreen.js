import React, { useEffect, useState } from "react";

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View
} from "react-native";

import promocionService from "../../services/promocionService";
import { COLORS, SIZES } from "../../constants/theme";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";

export default function PromocionFormScreen({ navigation, route }) {

    const promocionEditando = route.params?.promocion;

    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        valor: "",
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        activa: true
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (promocionEditando) {
            setForm({
                nombre: promocionEditando.nombre,
                descripcion: promocionEditando.descripcion || "",
                valor: promocionEditando.valor.toString(),
                fechaInicio: promocionEditando.fechaInicio?.split('T')[0] || "",
                fechaFin: promocionEditando.fechaFin?.split('T')[0] || "",
                activa: promocionEditando.activa
            });
        }
    }, [promocionEditando]);

    async function handleGuardar() {
        if (!form.nombre || !form.valor) {
            Alert.alert("Error", "Nombre y descuento son requeridos.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...form,
                tipo: "PORCENTAJE",
                valor: Number(form.valor)
            };

            if (promocionEditando) {
                await promocionService.actualizar(promocionEditando.idPromocion, payload);
                Alert.alert("Éxito", "Promoción actualizada.");
            } else {
                await promocionService.crear(payload);
                Alert.alert("Éxito", "Promoción creada.");
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>
                    {promocionEditando ? "Editar Promoción" : "Nueva Promoción"}
                </Text>

                <CustomInput
                    label="Nombre de la Promo"
                    placeholder="Ej: Black Friday 50%"
                    value={form.nombre}
                    onChangeText={(val) => setForm({ ...form, nombre: val })}
                />

                <CustomInput
                    label="Descripción"
                    placeholder="Detalles de la oferta..."
                    value={form.descripcion}
                    onChangeText={(val) => setForm({ ...form, descripcion: val })}
                />

                <CustomInput
                    label="Porcentaje de Descuento (%)"
                    placeholder="Ej: 20"
                    keyboardType="numeric"
                    value={form.valor}
                    onChangeText={(val) => setForm({ ...form, valor: val })}
                />

                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <CustomInput
                            label="Desde (AAAA-MM-DD)"
                            placeholder="2026-01-01"
                            value={form.fechaInicio}
                            onChangeText={(val) => setForm({ ...form, fechaInicio: val })}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <CustomInput
                            label="Hasta (AAAA-MM-DD)"
                            placeholder="2026-12-31"
                            value={form.fechaFin}
                            onChangeText={(val) => setForm({ ...form, fechaFin: val })}
                        />
                    </View>
                </View>

                <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Promoción activa</Text>
                    <Switch
                        value={form.activa}
                        onValueChange={(activa) => setForm({ ...form, activa })}
                        trackColor={{ false: COLORS.border, true: COLORS.primary }}
                    />
                </View>

                <CustomButton
                    title={promocionEditando ? "Actualizar Oferta" : "Lanzar Promoción"}
                    onPress={handleGuardar}
                    loading={loading}
                    style={styles.btn}
                />

                {promocionEditando && (
                    <CustomButton
                        title="Eliminar promoción"
                        variant="secondary"
                        onPress={() => Alert.alert(
                            "Eliminar promoción",
                            "¿Confirma que desea eliminar esta promoción?",
                            [
                                { text: "Cancelar", style: "cancel" },
                                {
                                    text: "Eliminar",
                                    style: "destructive",
                                    onPress: async () => {
                                        try {
                                            await promocionService.eliminar(promocionEditando.idPromocion);
                                            navigation.goBack();
                                        } catch (error) {
                                            Alert.alert("Error", error.response?.data?.message || "No se pudo eliminar.");
                                        }
                                    }
                                }
                            ]
                        )}
                        style={styles.deleteBtn}
                    />
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    scroll: {
        padding: SIZES.padding
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.white,
        marginBottom: 20
    },
    row: {
        flexDirection: "row"
    },
    btn: {
        marginTop: 20
    },
    deleteBtn: {
        marginTop: 12,
        backgroundColor: COLORS.error
    },
    switchRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10
    },
    switchLabel: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "bold"
    }
});
