import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

import productoService from "../../services/productoService";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { COLORS, SIZES } from "../../constants/theme";

export default function CategoriaFormScreen({ navigation, route }) {
    const categoria = route.params?.categoria;
    const [nombre, setNombre] = useState(categoria?.nombre || "");
    const [descripcion, setDescripcion] = useState(categoria?.descripcion || "");
    const [loading, setLoading] = useState(false);

    async function guardar() {
        if (nombre.trim().length < 2) {
            Alert.alert("Error", "Ingrese un nombre de al menos dos caracteres.");
            return;
        }
        try {
            setLoading(true);
            const data = { nombre: nombre.trim(), descripcion: descripcion.trim() || null, activa: categoria?.activa ?? true };
            if (categoria) await productoService.actualizarCategoria(categoria.idCategoria, data);
            else await productoService.crearCategoria(data);
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "No se pudo guardar la categoría.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <CustomInput label="Nombre" value={nombre} onChangeText={setNombre} placeholder="Ej: Bebidas" iconName="format-list-bulleted" />
            <CustomInput label="Descripción" value={descripcion} onChangeText={setDescripcion} placeholder="Descripción opcional" iconName="text" />
            <CustomButton title={categoria ? "Actualizar categoría" : "Crear categoría"} onPress={guardar} loading={loading} />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: SIZES.padding, backgroundColor: COLORS.background }
});
