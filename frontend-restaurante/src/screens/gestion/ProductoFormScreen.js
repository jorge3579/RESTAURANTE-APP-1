import React, { useEffect, useState } from "react";

import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import productoService from "../../services/productoService";
import { COLORS, SIZES } from "../../constants/theme";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { Picker } from "@react-native-picker/picker";
import { resolverProductoImagen } from "../../helpers/productoImagen";

export default function ProductoFormScreen({ navigation, route }) {

    const productoEditando = route.params?.producto;

    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        imagenUrl: null,
        idCategoria: "1", // Por defecto primera categoria
        disponible: true
    });

    const [loading, setLoading] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

    useEffect(() => {
        productoService.listarCategorias()
            .then((datos) => {
                const activas = datos.filter((item) => item.activa);
                setCategorias(activas);
                if (!productoEditando && activas[0]) {
                    setForm((actual) => ({ ...actual, idCategoria: String(activas[0].idCategoria) }));
                }
            })
            .catch(() => Alert.alert("Error", "No se pudieron cargar las categorías."));
    }, [productoEditando]);

    useEffect(() => {
        if (productoEditando) {
            setForm({
                nombre: productoEditando.nombre,
                descripcion: productoEditando.descripcion || "",
                precio: productoEditando.precio.toString(),
                imagenUrl: productoEditando.imagenUrl || null,
                idCategoria: productoEditando.idCategoria?.toString() || "1",
                disponible: productoEditando.disponible
            });
        }
    }, [productoEditando]);

    async function seleccionarImagen() {
        const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permiso.granted) {
            Alert.alert("Permiso necesario", "Autorice el acceso a las imágenes para seleccionar una foto del producto.");
            return;
        }
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8
        });
        if (!resultado.canceled && resultado.assets[0]) {
            setImagenSeleccionada(resultado.assets[0]);
        }
    }

    async function handleGuardar() {
        if (!form.nombre || !form.precio) {
            Alert.alert("Error", "El nombre y el precio son obligatorios.");
            return;
        }

        try {
            setLoading(true);
            let imagenUrl = form.imagenUrl;
            if (imagenSeleccionada) {
                const subida = await productoService.subirImagen(imagenSeleccionada);
                imagenUrl = subida.imagenUrl;
            }
            const payload = {
                ...form,
                imagenUrl,
                precio: parseFloat(form.precio),
                idCategoria: Number(form.idCategoria),
                activo: productoEditando?.activo ?? true
            };

            if (productoEditando) {
                await productoService.actualizar(productoEditando.idProducto, payload);
                Alert.alert("Éxito", "Producto actualizado correctamente.");
            } else {
                await productoService.crear(payload);
                Alert.alert("Éxito", "Producto creado correctamente.");
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar el producto.");
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
                    {productoEditando ? "Editar Producto" : "Nuevo Producto"}
                </Text>

                <CustomInput
                    label="Nombre del Producto"
                    placeholder="Ej: Hamburguesa Triple"
                    value={form.nombre}
                    onChangeText={(val) => setForm({ ...form, nombre: val })}
                />

                <CustomInput
                    label="Descripción"
                    placeholder="Detalles de los ingredientes..."
                    value={form.descripcion}
                    onChangeText={(val) => setForm({ ...form, descripcion: val })}
                />

                <CustomInput
                    label="Precio ($)"
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={form.precio}
                    onChangeText={(val) => setForm({ ...form, precio: val })}
                />

                <Text style={styles.label}>Imagen del producto</Text>
                {(imagenSeleccionada?.uri || form.imagenUrl) ? (
                    <Image
                        source={{ uri: imagenSeleccionada?.uri || resolverProductoImagen(form.imagenUrl) }}
                        style={styles.preview}
                    />
                ) : (
                    <View style={styles.imagePlaceholder}><Text style={styles.placeholderText}>Sin imagen</Text></View>
                )}
                <CustomButton
                    title={imagenSeleccionada || form.imagenUrl ? "Cambiar imagen" : "Subir imagen"}
                    onPress={seleccionarImagen}
                    variant="secondary"
                />

                <Text style={styles.label}>Categoría</Text>
                <View style={styles.pickerWrap}>
                    <Picker
                        selectedValue={form.idCategoria}
                        onValueChange={(value) => setForm({ ...form, idCategoria: value })}
                        dropdownIconColor={COLORS.primary}
                        style={styles.picker}
                    >
                        {categorias.map((categoria) => (
                            <Picker.Item
                                key={categoria.idCategoria}
                                label={categoria.nombre}
                                value={String(categoria.idCategoria)}
                            />
                        ))}
                    </Picker>
                </View>

                <CustomButton
                    title={productoEditando ? "Guardar Cambios" : "Crear Producto"}
                    onPress={handleGuardar}
                    loading={loading}
                    style={styles.btn}
                />

                {productoEditando && (
                    <CustomButton
                        title="Eliminar Producto"
                        variant="secondary"
                        onPress={() => {
                            Alert.alert(
                                "Eliminar",
                                "¿Seguro que desea eliminar este producto?",
                                [
                                    { text: "Cancelar", style: "cancel" },
                                    {
                                        text: "Eliminar",
                                        style: "destructive",
                                        onPress: async () => {
                                            await productoService.eliminar(productoEditando.idProducto);
                                            navigation.goBack();
                                        }
                                    }
                                ]
                            );
                        }}
                        textStyle={{ color: COLORS.error }}
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
    btn: {
        marginTop: 20
    },
    label: { color: COLORS.textLight, marginTop: 12, marginBottom: 6, fontWeight: "bold" },
    pickerWrap: { backgroundColor: COLORS.surface, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border },
    picker: { color: COLORS.white },
    preview: { width: "100%", height: 210, borderRadius: 12, marginBottom: 12, resizeMode: "cover" },
    imagePlaceholder: { width: "100%", height: 140, borderRadius: 12, marginBottom: 12, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
    placeholderText: { color: COLORS.textLight }
});
