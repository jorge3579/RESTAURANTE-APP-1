import React, { useEffect, useState } from "react";

import {
    Button,
    FlatList,
    RefreshControl,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import pedidoService from "../../services/pedidoService";

export default function PedidosScreen({ navigation }) {

    const [pedidos, setPedidos] = useState([]);

    const [refreshing, setRefreshing] = useState(false);

    async function cargar() {

        const datos = await pedidoService.listar();

        setPedidos(datos);

        setRefreshing(false);

    }

    useEffect(() => {
        cargar();
        const interval = setInterval(cargar, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={{ padding: 10 }}>
                <Button
                    title="Nuevo pedido"
                    onPress={() => navigation.navigate("NuevoPedido")}
                />
            </View>

            <FlatList
                data={pedidos}
                keyExtractor={(item) => item.idPedido.toString()}
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
                            navigation.navigate("DetallePedido", {
                                idPedido: item.idPedido
                            })
                        }
                    >
                        <View
                            style={{
                                backgroundColor: "#ffffff",
                                padding: 20,
                                margin: 10,
                                borderRadius: 10
                            }}
                        >
                            <Text>
                                Pedido #{item.idPedido}
                            </Text>

                            <Text>
                                Estado: {item.estado}
                            </Text>

                            <Text>
                                Total: ${item.total}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

        </SafeAreaView>
    );

}
