import React, { useEffect, useState } from "react";

import {
    FlatList,
    SafeAreaView,
    Text,
    View
} from "react-native";

import promocionService from "../../services/promocionService";

export default function PromocionesScreen() {

    const [promociones, setPromociones] = useState([]);

    async function cargar() {

        const datos = await promocionService.listarActivas();

        setPromociones(datos);

    }

    useEffect(() => {

        cargar();

    }, []);

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>

            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
                Promociones activas
            </Text>

            <FlatList
                data={promociones}
                keyExtractor={(item) => item.idPromocion.toString()}
                renderItem={({ item }) => (
                    <View
                        style={{
                            backgroundColor: "#ffffff",
                            padding: 16,
                            borderRadius: 10,
                            marginBottom: 12
                        }}
                    >
                        <Text style={{ fontWeight: "bold" }}>
                            {item.nombre}
                        </Text>

                        <Text>
                            {item.descripcion}
                        </Text>

                        <Text>
                            Tipo: {item.tipo}
                        </Text>

                        <Text>
                            Valor: {item.valor}
                        </Text>

                        <Text>
                            Vigencia: {item.fechaInicio} a {item.fechaFin}
                        </Text>
                    </View>
                )}
            />

        </SafeAreaView>
    );

}