import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import creditoService from "../../services/creditoService";

export default function CreditosScreen() {
    const [creditos, setCreditos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        creditoService.misCreditos()
            .then((datos) => setCreditos(datos || []))
            .finally(() => setCargando(false));
    }, []);

    if (cargando) return <ActivityIndicator style={styles.cargando} size="large" />;

    return (
        <FlatList
            contentContainerStyle={styles.contenido}
            data={creditos}
            keyExtractor={(item) => String(item.idCredito)}
            ListEmptyComponent={<Text>No hay créditos disponibles.</Text>}
            renderItem={({ item }) => (
                <View style={styles.tarjeta}>
                    <Text style={styles.saldo}>Saldo: ${Number(item.saldo || 0).toFixed(2)}</Text>
                    <Text>{item.motivo || "Crédito a favor"}</Text>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    cargando: { flex: 1 },
    contenido: { flexGrow: 1, padding: 20 },
    tarjeta: { backgroundColor: "#ffffff", borderRadius: 8, marginBottom: 12, padding: 16 },
    saldo: { fontSize: 18, fontWeight: "bold", marginBottom: 6 }
});
