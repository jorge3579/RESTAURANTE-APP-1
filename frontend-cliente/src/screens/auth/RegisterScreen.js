import React, { useState } from "react";

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import { registrar } from "../../services/authService";
import { obtenerMensajeApi } from "../../services/apiError";
import { COLORS, SIZES } from "../../constants/theme";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";

export default function RegisterScreen({ navigation }) {

    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        password: ""
    });

    const [cargando, setCargando] = useState(false);

    function actualizarCampo(campo, valor) {

        setForm({
            ...form,
            [campo]: valor
        });

    }

    async function handleRegister() {

        if (!form.nombre || !form.apellido || !form.email || !form.password) {
            Alert.alert("Error", "Por favor, complete los campos obligatorios.");
            return;
        }

        try {

            setCargando(true);

            await registrar(form);

            Alert.alert(
                "¡Cuenta creada!",
                "Bienvenido a SmartRestaurantQR. Ya puede iniciar sesión."
            );

            navigation.goBack();

        } catch (error) {

            Alert.alert(
                "Error",
                obtenerMensajeApi(
                    error,
                    "No se pudo registrar el usuario."
                )
            );

        } finally {

            setCargando(false);

        }

    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Crear cuenta</Text>
                        <Text style={styles.subtitle}>Únete a nuestra comunidad gourmet</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <CustomInput
                                    label="Nombre"
                                    placeholder="Nombre"
                                    iconName="account-outline"
                                    value={form.nombre}
                                    onChangeText={(valor) => actualizarCampo("nombre", valor)}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <CustomInput
                                    label="Apellido"
                                    placeholder="Apellido"
                                    value={form.apellido}
                                    onChangeText={(valor) => actualizarCampo("apellido", valor)}
                                />
                            </View>
                        </View>

                        <CustomInput
                            label="Email"
                            placeholder="ejemplo@correo.com"
                            iconName="email-outline"
                            keyboardType="email-address"
                            value={form.email}
                            onChangeText={(valor) => actualizarCampo("email", valor)}
                        />

                        <CustomInput
                            label="Teléfono"
                            placeholder="Ej: +54 9 11..."
                            iconName="phone-outline"
                            keyboardType="phone-pad"
                            value={form.telefono}
                            onChangeText={(valor) => actualizarCampo("telefono", valor)}
                        />

                        <CustomInput
                            label="Contraseña"
                            placeholder="Mínimo 6 caracteres"
                            iconName="lock-outline"
                            secureTextEntry
                            value={form.password}
                            onChangeText={(valor) => actualizarCampo("password", valor)}
                        />

                        <CustomButton
                            title="Registrarme"
                            onPress={handleRegister}
                            loading={cargando}
                            style={styles.registerButton}
                        />

                        <CustomButton
                            title="Volver al inicio"
                            variant="secondary"
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background
    },

    container: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        padding: SIZES.padding,
    },

    header: {
        marginTop: 20,
        marginBottom: 30,
        alignItems: "center"
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.secondary
    },

    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        marginTop: 5
    },

    form: {
        width: "100%"
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    registerButton: {
        marginTop: 10
    }

});
