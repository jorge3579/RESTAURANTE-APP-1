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

import { login } from "../../services/authService";
import { COLORS, SIZES } from "../../constants/theme";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";

export default function LoginScreen({ onLogin }) {

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
                "No se pudo iniciar sesión. Verifique sus credenciales de acceso de personal."
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
                            <Text style={styles.logoText}>RS</Text>
                        </View>
                        <Text style={styles.title}>
                            SmartRestaurantQR
                        </Text>
                        <Text style={styles.subtitle}>
                            Panel de Gestión del Restaurante
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <CustomInput
                            label="Email de Usuario"
                            placeholder="empleado@restaurante.com"
                            iconName="account-tie-outline"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <CustomInput
                            label="Contraseña"
                            placeholder="Su clave de acceso"
                            iconName="shield-key-outline"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <CustomButton
                            title="Entrar al Panel"
                            onPress={handleLogin}
                            loading={cargando}
                            style={styles.loginButton}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.versionText}>Versión Administrativa 2.0.0</Text>
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
        color: COLORS.black,
        fontSize: 32,
        fontWeight: "bold"
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: COLORS.text,
        textAlign: "center"
    },

    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: "center",
        marginTop: 5
    },

    form: {
        width: "100%"
    },

    loginButton: {
        marginTop: 10
    },

    footer: {
        marginTop: 40,
        alignItems: "center"
    },

    versionText: {
        color: "#BCBCBC",
        fontSize: 12
    }

});
