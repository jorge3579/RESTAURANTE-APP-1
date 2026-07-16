import React, { useEffect, useState } from "react";

import {
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import notificacionService from "../../services/notificacionService";

export default function NotificacionesScreen() {

    const [notificaciones, setNotificaciones] = useState([]);

    const [refreshing, setRefreshing] = useState(false);

    async function cargar() {
        try {
            const datos = await notificacionService.listar();
            setNotificaciones(datos);
        } catch {
            Alert.alert("Error", "No se pudieron cargar los avisos.");
        } finally {
            setRefreshing(false);
        }

    }

    async function marcarLeida(idNotificacion) {

        try {
            await notificacionService.marcarLeida(idNotificacion);
            cargar();
        } catch {
            Alert.alert("Error", "No se pudo marcar el aviso como leído.");
        }

    }

    useEffect(() => {

        cargar();

    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={notificaciones}
                keyExtractor={(item) => item.idNotificacion.toString()}
                ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 40, color: "#666666" }}>No hay avisos nuevos.</Text>}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            cargar();
                        }}
                    />
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => marcarLeida(item.idNotificacion)}
                    >
                        <View
                            style={{
                                backgroundColor: item.leida ? "#eeeeee" : "#ffffff",
                                padding: 20,
                                margin: 10,
                                borderRadius: 10
                            }}
                        >
                            <Text style={{ fontWeight: "bold" }}>
                                {item.titulo}
                            </Text>

                            <Text>
                                {item.mensaje}
                            </Text>

                            <Text style={{ marginTop: 8, color: "#666666" }}>
                                {item.tipo}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );

}
