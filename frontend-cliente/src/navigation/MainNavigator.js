import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import HomeScreen from "../screens/main/HomeScreen";
import MenuScreen from "../screens/main/MenuScreen";
import PerfilScreen from "../screens/main/PerfilScreen";
import NotificacionesScreen from "../screens/notificaciones/NotificacionesScreen";
import ReservasNavigator from "./ReservasNavigator";
import PedidosNavigator from "./PedidosNavigator";
import BeneficiosNavigator from "./BeneficiosNavigator";
import { COLORS } from "../constants/theme";

const Tab = createBottomTabNavigator();

export default function MainNavigator({ usuario, onLogout }) {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Inicio") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Reservas") {
                        iconName = focused ? "calendar-clock" : "calendar-clock-outline";
                    } else if (route.name === "Menú") {
                        iconName = focused ? "silverware-variant" : "silverware";
                    } else if (route.name === "Pedidos") {
                        iconName = focused ? "clipboard-list" : "clipboard-list-outline";
                    } else if (route.name === "Beneficios") {
                        iconName = focused ? "star-circle" : "star-circle-outline";
                    } else if (route.name === "Avisos") {
                        iconName = focused ? "bell" : "bell-outline";
                    } else if (route.name === "Perfil") {
                        iconName = focused ? "account" : "account-outline";
                    }

                    return (
                        <MaterialCommunityIcons
                            name={iconName}
                            size={size}
                            color={color}
                        />
                    );
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textLight,
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 10,
                    paddingTop: 5
                },
                headerStyle: {
                    backgroundColor: COLORS.white,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.border
                },
                headerTitleStyle: {
                    fontWeight: "bold",
                    color: COLORS.secondary
                }
            })}
        >
            <Tab.Screen
                name="Inicio"
                component={HomeScreen}
            />

            <Tab.Screen
                name="Reservas"
                component={ReservasNavigator}
                options={{
                    headerShown: false
                }}
            />

            <Tab.Screen
                name="Menú"
                component={MenuScreen}
            />

            <Tab.Screen
                name="Pedidos"
                component={PedidosNavigator}
                options={{
                    headerShown: false
                }}
            />

            <Tab.Screen
                name="Beneficios"
                component={BeneficiosNavigator}
                options={{
                    headerShown: false
                }}
            />

            <Tab.Screen
                name="Avisos"
                component={NotificacionesScreen}
            />

            <Tab.Screen
                name="Perfil"
            >
                {(props) => (
                    <PerfilScreen
                        {...props}
                        usuario={usuario}
                        onLogout={onLogout}
                    />
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );

}