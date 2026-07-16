import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/LoginScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator({ onLogin }) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" options={{ title: "Iniciar sesión" }}>
                {(props) => <LoginScreen {...props} onLogin={onLogin} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
