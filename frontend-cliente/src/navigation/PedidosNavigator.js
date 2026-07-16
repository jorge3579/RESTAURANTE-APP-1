import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import NuevoPedidoScreen from "../screens/pedidos/NuevoPedidoScreen";
import DetallePedidoScreen from "../screens/pedidos/DetallePedidoScreen";
import PedidosScreen from "../screens/pedidos/PedidosScreen";

const Stack = createNativeStackNavigator();

export default function PedidosNavigator() {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ListadoPedidos"
                component={PedidosScreen}
                options={{
                    title: "Mis pedidos"
                }}
            />

            <Stack.Screen
                name="NuevoPedido"
                component={NuevoPedidoScreen}
                options={{
                    title: "Nuevo pedido"
                }}
            />

            <Stack.Screen
                name="DetallePedido"
                component={DetallePedidoScreen}
                options={{
                    title: "Detalle pedido"
                }}
            />
        </Stack.Navigator>
    );

}