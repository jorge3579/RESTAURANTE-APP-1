import React, { useEffect, useState } from "react";

import {
    Alert,
    Button,
    FlatList,
    RefreshControl,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import reservaService from "../../services/reservaService";

export default function ReservasScreen({ navigation }) {

    const [reservas, setReservas] = useState([]);

    const [refreshing, setRefreshing] = useState(false);

    async function cargar() {
        try {
            const datos = await reservaService.listar();
            setReservas(datos);
        } catch {
            Alert.alert("Error", "No se pudieron cargar las reservas.");
        } finally {
            setRefreshing(false);
        }

    }

    useEffect(() => {

        cargar();

    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={{ padding: 10 }}>
                <Button
                    title="Nueva reserva"
                    onPress={() => navigation.navigate("NuevaReserva")}
                />
            </View>

            <FlatList
                data={reservas}
                keyExtractor={(item) => item.idReserva.toString()}
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
                        onPress={() =>
                            navigation.navigate("DetalleReserva", {
                                idReserva: item.idReserva
                            })
                        }
                    >
                        <View
                            style={{
                                backgroundColor: "#FFF",
                                padding: 20,
                                margin: 10,
                                borderRadius: 10
                            }}
                        >
                            <Text>
                                Reserva #{item.idReserva}
                            </Text>

                            <Text>
                                {new Date(item.fechaReserva).toLocaleDateString()} - {String(item.horaReserva).slice(0, 5)}
                            </Text>

                            <Text>
                                {item.estado}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

        </SafeAreaView>
    );

}
