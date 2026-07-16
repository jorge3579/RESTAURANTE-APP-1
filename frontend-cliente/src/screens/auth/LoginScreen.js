import React, { useState } from "react";

import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import { login } from "../../services/authService";
import { obtenerMensajeApi } from "../../services/apiError";
import { COLORS, SIZES } from "../../constants/theme";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";

export default function LoginScreen({ navigation, onLogin }) {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [cargando, setCargando] = useState(false);

    async function handleLogin() {

        if (!email || !password) {
            Alert.alert("Error", "Por favor, complete todos los campos.");
            return;
        }

        try {

            setCargando(true);

            const usuario = await login(
                email,
                password
            );

            onLogin(usuario);

        } catch (error) {

            Alert.alert(
                "Error",
                obtenerMensajeApi(
                    error,
                    "No se pudo iniciar sesión. Verifique sus datos."
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
                        <View style={styles.logoPlaceholder}>
                            <Text style={styles.logoText}>SR</Text>
                        </View>
                        <Text style={styles.title}>
                            SmartRestaurantQR
                        </Text>
                        <Text style={styles.subtitle}>
                            Bienvenido, inicie sesión para continuar
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <CustomInput
                            label="Correo Electrónico"
                            placeholder="ejemplo@correo.com"
                            iconName="email-outline"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <CustomInput
                            label="Contraseña"
                            placeholder="Su contraseña"
                            iconName="lock-outline"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <CustomButton
                            title="Ingresar"
                            onPress={handleLogin}
                            loading={cargando}
                            style={styles.loginButton}
                        />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
                            <Text
                                style={styles.link}
                                onPress={() => navigation.navigate("Register")}
                            >
                                Regístrate aquí
                            </Text>
                        </View>
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
        justifyContent: "center"
    },

    header: {
        alignItems: "center",
        marginBottom: 40
    },

    logoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
            },
            android: {
                elevation: 10,
            },
        }),
    },

    logoText: {
        color: COLORS.white,
        fontSize: 32,
        fontWeight: "bold"
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.secondary,
        textAlign: "center"
    },

    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: "center",
        marginTop: 10
    },

    form: {
        width: "100%"
    },

    loginButton: {
        marginTop: 10
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20
    },

    footerText: {
        color: COLORS.textLight,
        fontSize: 15
    },

    link: {
        color: COLORS.primary,
        fontSize: 15,
        fontWeight: "bold"
    }

});
