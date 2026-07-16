import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ReservasScreen from "../screens/main/ReservasScreen";
import NuevaReservaScreen from "../screens/reservas/NuevaReservaScreen";
import DetalleReservaScreen from "../screens/reservas/DetalleReservaScreen";
import ReservaQRScreen from "../screens/reservas/ReservaQRScreen";

const Stack = createNativeStackNavigator();

export default function ReservasNavigator() {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ListadoReservas"
                component={ReservasScreen}
                options={{
                    title: "Mis reservas"
                }}
            />

            <Stack.Screen
                name="NuevaReserva"
                component={NuevaReservaScreen}
                options={{
                    title: "Nueva reserva"
                }}
            />

            <Stack.Screen
                name="DetalleReserva"
                component={DetalleReservaScreen}
                options={{
                    title: "Detalle reserva"
                }}
            />

            <Stack.Screen
                name="ReservaQR"
                component={ReservaQRScreen}
                options={{
                    title: "QR de ingreso"
                }}
            />
        </Stack.Navigator>
    );

}