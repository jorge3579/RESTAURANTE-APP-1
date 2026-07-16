import React, { useEffect, useState } from "react";

import { ActivityIndicator, View } from "react-native";

import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";

import { obtenerUsuarioGuardado } from "../services/authService";
import { setUnauthorizedHandler } from "../services/httpClient";

export default function AppNavigator() {

    const [cargando, setCargando] = useState(true);

    const [usuario, setUsuario] = useState(null);

    async function verificarSesion() {

        const usuarioGuardado = await obtenerUsuarioGuardado();

        setUsuario(usuarioGuardado);

        setCargando(false);

    }

    useEffect(() => {
        setUnauthorizedHandler(() => setUsuario(null));
        verificarSesion();
        return () => setUnauthorizedHandler(null);
    }, []);

    if (cargando) {

        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        );

    }

    if (!usuario) {

        return (
            <AuthNavigator
                onLogin={setUsuario}
            />
        );

    }

    return (
        <MainNavigator
            usuario={usuario}
            onLogout={() => setUsuario(null)}
        />
    );

}
