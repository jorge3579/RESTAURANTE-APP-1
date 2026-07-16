import React, { useEffect, useState } from "react";

import {
    Alert,
    Button,
    FlatList,
    SafeAreaView,
    Text,
    View
} from "react-native";

import fidelizacionService from "../../services/fidelizacionService";

export default function FidelizacionScreen({ navigation }) {

    const [puntos, setPuntos] = useState(null);

    const [historial, setHistorial] = useState([]);

    async function cargar() {

        const datosPuntos = await fidelizacionService.misPuntos();

        const datosHistorial = await fidelizacionService.historial();

        setPuntos(datosPuntos);

        setHistorial(datosHistorial);

    }

    async function canjear() {

        try {

            const resultado = await fidelizacionService.canjearPremio();

            setPuntos(resultado);

            Alert.alert(
                "Premio canjeado",
                "Se generó tu premio correctamente."
            );

            cargar();

        } catch (error) {

            Alert.alert(
                "No disponible",
                "Todavía no alcanzaste las compras necesarias."
            );

        }

    }

    useEffect(() => {

        cargar();

    }, []);

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <View
                style={{
                    backgroundColor: "#ffffff",
                    padding: 20,
                    borderRadius: 10,
                    marginBottom: 20
                }}
            >
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                    Fidelización
                </Text>

                <Text>
                    Puntos: {puntos?.puntos ?? 0}
                </Text>

                <Text>
                    Compras acumuladas: {puntos?.comprasAcumuladas ?? 0}
                </Text>

                <Text>
                    Nivel VIP: {puntos?.nivelVIP ?? "Sin nivel"}
                </Text>

                <Text>
                    Descuento: {puntos?.descuentoPorcentaje ?? 0}%
                </Text>

                <View style={{ height: 15 }} />

                <Button
                    title="Canjear premio"
                    onPress={canjear}
                />

                <View style={{ height: 10 }} />

                <Button
                    title="Ver promociones"
                    onPress={() => navigation.navigate("Promociones")}
                />

                <View style={{ height: 10 }} />

                <Button
                    title="Ver mis créditos"
                    onPress={() => navigation.navigate("Creditos")}
                />
            </View>

            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
                Historial
            </Text>

            <FlatList
                data={historial}
                keyExtractor={(item) => item.idHistorialPuntos.toString()}
                renderItem={({ item }) => (
                    <View
                        style={{
                            backgroundColor: "#ffffff",
                            padding: 14,
                            borderRadius: 8,
                            marginBottom: 10
                        }}
                    >
                        <Text>
                            {item.descripcion}
                        </Text>

                        <Text>
                            Puntos: {item.puntos}
                        </Text>

                        <Text>
                            {item.tipoMovimiento}
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );

}
