import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FidelizacionScreen from "../screens/fidelizacion/FidelizacionScreen";
import CreditosScreen from "../screens/creditos/CreditosScreen";
import PromocionesScreen from "../screens/promociones/PromocionesScreen";

const Stack = createNativeStackNavigator();

export default function BeneficiosNavigator() {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Fidelizacion"
                component={FidelizacionScreen}
                options={{
                    title: "Puntos y nivel VIP"
                }}
            />

            <Stack.Screen
                name="Creditos"
                component={CreditosScreen}
                options={{
                    title: "Mis créditos"
                }}
            />

            <Stack.Screen
                name="Promociones"
                component={PromocionesScreen}
                options={{
                    title: "Promociones"
                }}
            />
        </Stack.Navigator>
    );

}