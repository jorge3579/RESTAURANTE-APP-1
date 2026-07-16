import React, { useEffect, useState } from "react";

import {
    Alert,
    Button,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

import productoService from "../../services/productoService";
import pedidoService from "../../services/pedidoService";
import sucursalService from "../../services/sucursalService";
import { resolverProductoImagen } from "../../helpers/productoImagen";

export default function NuevoPedidoScreen({ navigation, route }) {

    const [productos, setProductos] = useState([]);

    const [carrito, setCarrito] = useState([]);

    const [idSucursal, setIdSucursal] = useState("1");
    const [sucursales, setSucursales] = useState([]);

    async function cargarProductos() {

        const datos = await productoService.listar();

        setProductos(datos);

    }

    function cambiarCantidad(producto, delta = 1) {

        const existente = carrito.find(
            (item) => item.idProducto === producto.idProducto
        );

        if (existente) {
            const nuevaCantidad = existente.cantidad + delta;
            setCarrito(nuevaCantidad <= 0
                ? carrito.filter((item) => item.idProducto !== producto.idProducto)
                : carrito.map((item) => item.idProducto === producto.idProducto
                    ? { ...item, cantidad: nuevaCantidad }
                    : item));

            return;

        }

        if (delta < 1) return;

        setCarrito([
            ...carrito,
            {
                idProducto: producto.idProducto,
                nombre: producto.nombre,
                cantidad: 1,
                precioUnitario: producto.precio
            }
        ]);

    }

    async function crearPedido() {

        try {

            if (carrito.length === 0) {
                Alert.alert("Atención", "Debe agregar productos al pedido.");
                return;
            }

            const pedido = await pedidoService.crear({
                idSucursal: Number(idSucursal),
                tipoConsumo: "LOCAL",
                detalles: carrito
            });

            Alert.alert(
                "Pedido creado",
                "El pedido fue creado correctamente."
            );

            navigation.navigate("DetallePedido", {
                idPedido: pedido.idPedido
            });

        } catch (error) {

            Alert.alert(
                "Error",
                "No se pudo crear el pedido."
            );

        }

    }

    useEffect(() => {
        async function cargarInicial() {
            await cargarProductos();
            const datosSucursales = await sucursalService.listar();
            setSucursales(datosSucursales.filter((item) => item.activo));
            if (datosSucursales[0]) setIdSucursal(String(datosSucursales[0].idSucursal));
        }
        cargarInicial();
    }, []);

    useEffect(() => {
        const productoInicial = route.params?.productoInicial;
        if (productoInicial && !carrito.some((item) => item.idProducto === productoInicial.idProducto)) {
            cambiarCantidad(productoInicial);
            navigation.setParams({ productoInicial: null });
        }
    }, [route.params?.productoInicial]);

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Nuevo pedido
            </Text>

            <Text style={styles.subtitle}>Sucursal</Text>
            <View style={styles.sucursales}>
                {sucursales.map((sucursal) => (
                    <Button
                        key={sucursal.idSucursal}
                        title={`${idSucursal === String(sucursal.idSucursal) ? "✓ " : ""}${sucursal.nombre}`}
                        onPress={() => setIdSucursal(String(sucursal.idSucursal))}
                    />
                ))}
            </View>

            <Text style={styles.subtitle}>
                Productos
            </Text>

            <FlatList
                data={productos}
                keyExtractor={(item) => item.idProducto.toString()}
                renderItem={({ item }) => (
                    <View style={styles.producto}>
                        {!!item.imagenUrl && <Image source={{ uri: resolverProductoImagen(item.imagenUrl) }} style={styles.productoImagen} />}
                        <View style={styles.productoInfo}>
                            <Text style={styles.productoNombre}>
                                {item.nombre}
                            </Text>

                            <Text>
                                ${item.precio}
                            </Text>
                        </View>

                        <View style={styles.cantidadControles}>
                            <Button title="−" onPress={() => cambiarCantidad(item, -1)} />
                            <Text style={styles.cantidad}>{carrito.find((p) => p.idProducto === item.idProducto)?.cantidad || 0}</Text>
                            <Button title="+" onPress={() => cambiarCantidad(item, 1)} />
                        </View>
                    </View>
                )}
            />

            <Text style={styles.subtitle}>
                Total: ${carrito.reduce((total, item) => total + Number(item.precioUnitario) * item.cantidad, 0).toFixed(2)}
            </Text>

            <Button
                title="Crear pedido"
                onPress={crearPedido}
            />

        </View>
    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#ffffff"
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 16
    },

    subtitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 12
    },

    input: {
        borderWidth: 1,
        borderColor: "#cccccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12
    },

    producto: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#eeeeee",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    productoNombre: {
        fontWeight: "bold"
    },

    sucursales: {
        gap: 8,
        marginBottom: 12
    },

    productoImagen: { width: 58, height: 58, borderRadius: 8, marginRight: 10, resizeMode: "cover" },
    productoInfo: { flex: 1 },
    cantidadControles: { flexDirection: "row", alignItems: "center", gap: 6 },
    cantidad: { minWidth: 24, textAlign: "center", fontWeight: "bold", fontSize: 16 }

});
