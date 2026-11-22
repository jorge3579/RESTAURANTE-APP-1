import React from "react";
import { TouchableOpacity } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import DashboardScreen from "../screens/main/DashboardScreen";
import CocinaScreen from "../screens/cocina/CocinaScreen";
import ScannerQRScreen from "../screens/qr/ScannerQRScreen";
import CajaScreen from "../screens/caja/CajaScreen";
import PedidosRestauranteScreen from "../screens/pedidos/PedidosRestauranteScreen";
import PerfilScreen from "../screens/main/PerfilScreen";
import GestionNavigator from "./GestionNavigator";
import ReservasRestauranteScreen from "../screens/reservas/ReservasRestauranteScreen";
import StockWebScreen from "../screens/stock/StockWebScreen";
import { COLORS } from "../constants/theme";
import { RefreshProvider, useGlobalRefresh } from "../context/RefreshContext";
import { SucursalProvider } from "../context/SucursalContext";

const Tab = createBottomTabNavigator();

function RestaurantTabs({ usuario, onLogout }) {

    const { refresh } = useGlobalRefresh();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Dashboard") {
                        iconName = focused ? "view-dashboard" : "view-dashboard-outline";
                    } else if (route.name === "Pedidos") {
                        iconName = focused ? "clipboard-list" : "clipboard-list-outline";
                    } else if (route.name === "Cocina") {
                        iconName = focused ? "chef-hat" : "chef-hat";
                    } else if (route.name === "QR") {
                        iconName = "qrcode-scan";
                    } else if (route.name === "Caja") {
                        iconName = focused ? "cash-register" : "cash-register";
                    } else if (route.name === "Stock") {
                        iconName = focused ? "warehouse" : "warehouse";
                    } else if (route.name === "Gestión") {
                        iconName = focused ? "store-edit" : "store-edit-outline";
                    } else if (route.name === "Perfil") {
                        iconName = focused ? "account-cog" : "account-cog-outline";
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
                    height: 65,
                    paddingBottom: 10,
                    paddingTop: 5,
                    backgroundColor: COLORS.surface,
                    borderTopColor: COLORS.border
                },
                headerStyle: {
                    backgroundColor: COLORS.surface,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.border,
                    elevation: 0,
                    shadowOpacity: 0
                },
                headerTitleStyle: {
                    fontWeight: "bold",
                    color: COLORS.white
                },
                headerRight: () => (
                    <TouchableOpacity
                        onPress={refresh}
                        accessibilityLabel="Actualizar pantalla"
                        style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                    >
                        <MaterialCommunityIcons name="refresh" size={25} color={COLORS.primary} />
                    </TouchableOpacity>
                )
            })}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
            />

            <Tab.Screen
                name="Stock"
                component={StockWebScreen}
                options={{
                    title: "Stock",
                    tabBarLabel: "Stock",
                    tabBarAccessibilityLabel: "Abrir Stock web",
                    headerShown: false
                }}
            />

            <Tab.Screen
                name="Pedidos"
                component={PedidosRestauranteScreen}
            />

            <Tab.Screen
                name="Cocina"
                component={CocinaScreen}
            />

            <Tab.Screen
                name="QR"
                component={ScannerQRScreen}
            />

            <Tab.Screen
                name="Gestión"
                component={GestionNavigator}
                options={{
                    headerShown: false
                }}
            />

            <Tab.Screen
                name="Caja"
                component={CajaScreen}
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

            <Tab.Screen
                name="ReservasLocal"
                component={ReservasRestauranteScreen}
                options={{
                    title: "Reservas",
                    tabBarButton: () => null,
                    tabBarItemStyle: { display: "none" }
                }}
            />
        </Tab.Navigator>
    );

}

export default function MainNavigator(props) {
    return (
        <RefreshProvider>
            <SucursalProvider>
                <RestaurantTabs {...props} />
            </SucursalProvider>
        </RefreshProvider>
    );
}
