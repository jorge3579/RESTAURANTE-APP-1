import React, { useEffect, useState, useMemo } from "react";
import {
    Alert,
    Image,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Modal
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import sucursalService from "../../services/sucursalService";
import reservaService from "../../services/reservaService";
import productoService from "../../services/productoService";
import pedidoService from "../../services/pedidoService";
import { COLORS, SHADOWS, SIZES } from "../../constants/theme";
import CustomButton from "../../components/CustomButton";
import { resolverProductoImagen } from "../../helpers/productoImagen";

export default function NuevaReservaScreen({ navigation }) {
    const [step, setStep] = useState(1);
    const [sucursales, setSucursales] = useState([]);
    const [productos, setProductos] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [loading, setLoading] = useState(true);
    const [procesando, setProcesando] = useState(false);

    const [form, setForm] = useState({
        idSucursal: null,
        fecha: new Date(),
        hora: new Date(),
        cantidadPersonas: "2",
        observaciones: ""
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        async function cargar() {
            try {
                const [s, p] = await Promise.all([
                    sucursalService.listar(),
                    productoService.listar()
                ]);
                const activas = s.filter(item => item.activo);
                setSucursales(activas);
                setProductos(p);
                if (activas[0]) {
                    setForm(f => ({ ...f, idSucursal: activas[0].idSucursal }));
                    cargarHorarios(activas[0].idSucursal);
                }
            } catch (error) {
                Alert.alert("Error", "No se pudo cargar la información necesaria.");
            } finally {
                setLoading(false);
            }
        }
        cargar();
    }, []);

    async function cargarHorarios(id) {
        try {
            const h = await sucursalService.listarHorarios(id);
            setHorarios(h);
        } catch (error) {
            console.error("Error al cargar horarios:", error);
        }
    }

    function cambiarSucursal(id) {
        setForm(f => ({ ...f, idSucursal: id }));
        cargarHorarios(id);
    }

    function cambiarCantidad(producto, delta) {
        setCarrito(actual => {
            const existente = actual.find(item => item.idProducto === producto.idProducto);
            const nuevaCant = (existente?.cantidad || 0) + delta;

            if (nuevaCant <= 0) {
                return actual.filter(item => item.idProducto !== producto.idProducto);
            }

            if (existente) {
                return actual.map(item => item.idProducto === producto.idProducto ? { ...item, cantidad: nuevaCant } : item);
            }

            return [...actual, {
                idProducto: producto.idProducto,
                nombre: producto.nombre,
                precioUnitario: producto.precio,
                cantidad: 1
            }];
        });
    }

    const total = useMemo(() => {
        return carrito.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
    }, [carrito]);

    const esHorarioValido = useMemo(() => {
        if (horarios.length === 0) return true; // Si no hay horarios definidos, permitimos todo (fallback)

        const diaSemanaJs = form.fecha.getDay();
        const diaSemana = diaSemanaJs === 0 ? 7 : diaSemanaJs; // 1=Lunes, 7=Domingo

        const horarioDia = horarios.find(h => h.diaSemana === diaSemana);
        if (!horarioDia || horarioDia.cerrado) return false;

        const horaElegida = form.hora.getHours() * 60 + form.hora.getMinutes();

        const checkTime = (apertura, cierre) => {
            if (!apertura || !cierre) return false;
            const [hA, mA] = apertura.split(':').map(Number);
            const [hC, mC] = cierre.split(':').map(Number);
            const desde = hA * 60 + mA;
            const hasta = hC * 60 + mC;
            return hasta < desde
                ? horaElegida >= desde || horaElegida <= hasta
                : horaElegida >= desde && horaElegida <= hasta;
        };

        const enRango1 = checkTime(horarioDia.horaApertura, horarioDia.horaCierre);
        const enRango2 = checkTime(horarioDia.horaApertura2, horarioDia.horaCierre2);

        return enRango1 || enRango2;
    }, [form.fecha, form.hora, horarios]);

    async function handleConfirmar() {
        if (!esHorarioValido) {
            Alert.alert("Local cerrado", "El horario seleccionado está fuera del horario de atención de esta sucursal.");
            return;
        }

        if (carrito.length === 0) {
            Alert.alert("Menú vacío", "Por favor selecciona al menos un producto para tu reserva.");
            return;
        }

        try {
            setProcesando(true);

            // 1. Crear Reserva
            const reserva = await reservaService.crear({
                idSucursal: form.idSucursal,
                fechaReserva: form.fecha.toISOString().split('T')[0],
                horaReserva: form.hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                cantidadPersonas: Number(form.cantidadPersonas),
                observaciones: form.observaciones
            });

            // 2. Crear Pedido asociado
            const pedido = await pedidoService.crear({
                idReserva: reserva.idReserva,
                idSucursal: form.idSucursal,
                tipoConsumo: "LOCAL",
                detalles: carrito.map(i => ({ idProducto: i.idProducto, cantidad: i.cantidad })),
                observaciones: "Reserva anticipada"
            });

            // 3. Ir al detalle para pago
            Alert.alert("Reserva registrada", "Tu reserva ha sido creada. Procede al pago para confirmar tu lugar.");

            navigation.getParent()?.navigate("Pedidos", {
                screen: "DetallePedido",
                initial: false,
                params: { idPedido: pedido.idPedido }
            });

        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "No se pudo crear la reserva.");
        } finally {
            setProcesando(false);
        }
    }

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary}/></View>;

    return (
        <View style={styles.container}>
            {/* Steps Progress */}
            <View style={styles.progressBar}>
                {[1, 2, 3].map(i => (
                    <View key={i} style={[styles.progressStep, step >= i && styles.progressActive]} />
                ))}
            </View>

            {step === 1 && (
                <View style={styles.step}>
                    <Text style={styles.stepTitle}>Paso 1: ¿Dónde y Cuándo?</Text>

                    <Text style={styles.label}>Sucursal</Text>
                    <View style={styles.pickerWrap}>
                        <Picker
                            selectedValue={form.idSucursal}
                            onValueChange={cambiarSucursal}
                        >
                            {sucursales.map(s => <Picker.Item key={s.idSucursal} label={s.nombre} value={s.idSucursal} />)}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Fecha</Text>
                    <TouchableOpacity style={styles.inputRow} onPress={() => setShowDatePicker(true)}>
                        <MaterialCommunityIcons name="calendar-month" size={24} color={COLORS.primary} />
                        <Text style={styles.inputText}>{form.fecha.toLocaleDateString()}</Text>
                    </TouchableOpacity>

                    <Text style={styles.label}>Hora</Text>
                    <TouchableOpacity style={[styles.inputRow, !esHorarioValido && styles.inputError]} onPress={() => setShowTimePicker(true)}>
                        <MaterialCommunityIcons name="clock-outline" size={24} color={esHorarioValido ? COLORS.primary : COLORS.error} />
                        <Text style={[styles.inputText, !esHorarioValido && { color: COLORS.error }]}>
                            {form.hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </TouchableOpacity>
                    {!esHorarioValido && <Text style={styles.errorText}>El local se encuentra cerrado en este horario.</Text>}

                    <Text style={styles.label}>Cantidad de personas</Text>
                    <View style={styles.pickerWrap}>
                        <Picker
                            selectedValue={form.cantidadPersonas}
                            onValueChange={(v) => setForm(f => ({ ...f, cantidadPersonas: v }))}
                        >
                            {[1,2,3,4,5,6,7,8,9,10].map(n => <Picker.Item key={n} label={`${n} ${n===1?'persona':'personas'}`} value={n.toString()} />)}
                        </Picker>
                    </View>

                    <View style={styles.flex} />
                    <CustomButton title="Siguiente" onPress={() => setStep(2)} />
                </View>
            )}

            {step === 2 && (
                <View style={styles.step}>
                    <Text style={styles.stepTitle}>Paso 2: ¿Qué van a comer?</Text>
                    <FlatList
                        data={productos}
                        keyExtractor={i => i.idProducto.toString()}
                        renderItem={({ item }) => {
                            const cant = carrito.find(c => c.idProducto === item.idProducto)?.cantidad || 0;
                            return (
                                <View style={styles.productCard}>
                                    {!!item.imagenUrl && <Image source={{ uri: resolverProductoImagen(item.imagenUrl) }} style={styles.productThumb} />}
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.prodName}>{item.nombre}</Text>
                                        <Text style={styles.prodPrice}>${item.precio}</Text>
                                    </View>
                                    <View style={styles.qtyRow}>
                                        <TouchableOpacity onPress={() => cambiarCantidad(item, -1)}>
                                            <MaterialCommunityIcons name="minus-circle-outline" size={28} color={COLORS.textLight} />
                                        </TouchableOpacity>
                                        <Text style={styles.qtyValue}>{cant}</Text>
                                        <TouchableOpacity onPress={() => cambiarCantidad(item, 1)}>
                                            <MaterialCommunityIcons name="plus-circle" size={28} color={COLORS.primary} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        }}
                    />
                    <View style={styles.summaryFooter}>
                        <Text style={styles.totalLabel}>Total estimado:</Text>
                        <Text style={styles.totalVal}>${total.toFixed(2)}</Text>
                    </View>
                    <View style={styles.btnRow}>
                        <CustomButton title="Volver" variant="secondary" style={{ flex: 1, marginRight: 10 }} onPress={() => setStep(1)} />
                        <CustomButton title="Siguiente" style={{ flex: 1.5 }} onPress={() => setStep(3)} />
                    </View>
                </View>
            )}

            {step === 3 && (
                <View style={styles.step}>
                    <Text style={styles.stepTitle}>Paso 3: Confirmar</Text>
                    <ScrollView style={styles.confirmScroll}>
                        <View style={styles.confirmCard}>
                            <Text style={styles.confirmHeader}>Resumen de Reserva</Text>
                            <View style={styles.confirmRow}>
                                <MaterialCommunityIcons name="store" size={20} color={COLORS.primary} />
                                <Text style={styles.confirmText}>{sucursales.find(s=>s.idSucursal===form.idSucursal)?.nombre}</Text>
                            </View>
                            <View style={styles.confirmRow}>
                                <MaterialCommunityIcons name="calendar" size={20} color={COLORS.primary} />
                                <Text style={styles.confirmText}>{form.fecha.toLocaleDateString()} - {form.hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs</Text>
                            </View>
                            <View style={styles.confirmRow}>
                                <MaterialCommunityIcons name="account-group" size={20} color={COLORS.primary} />
                                <Text style={styles.confirmText}>{form.cantidadPersonas} personas</Text>
                            </View>

                            <Text style={styles.confirmSub}>Pedido:</Text>
                            {carrito.map(i => (
                                <Text key={i.idProducto} style={styles.confirmItem}>• {i.nombre} x{i.cantidad} (${i.precioUnitario * i.cantidad})</Text>
                            ))}
                            <View style={styles.divider} />
                            <Text style={styles.confirmTotal}>A PAGAR: ${total.toFixed(2)}</Text>
                        </View>
                    </ScrollView>

                    <CustomButton title={procesando ? "Procesando..." : "Confirmar y Pagar"} onPress={handleConfirmar} loading={procesando} />
                    <CustomButton title="Volver" variant="secondary" onPress={() => setStep(2)} />
                </View>
            )}

            {showDatePicker && (
                <DateTimePicker
                    value={form.fecha}
                    mode="date"
                    minimumDate={new Date()}
                    onChange={(e, d) => { setShowDatePicker(false); if (d) setForm(f => ({ ...f, fecha: d })); }}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    value={form.hora}
                    mode="time"
                    is24Hour={true}
                    onChange={(e, d) => { setShowTimePicker(false); if (d) setForm(f => ({ ...f, hora: d })); }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    progressBar: { flexDirection: "row", padding: 20, gap: 10 },
    progressStep: { flex: 1, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
    progressActive: { backgroundColor: COLORS.primary },
    step: { flex: 1, padding: SIZES.padding },
    stepTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: COLORS.secondary },
    label: { fontWeight: "bold", color: COLORS.text, marginTop: 15, marginBottom: 5 },
    pickerWrap: { backgroundColor: COLORS.white, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
    inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border },
    inputError: { borderColor: COLORS.error },
    inputText: { marginLeft: 10, fontSize: 16, color: COLORS.text },
    errorText: { color: COLORS.error, fontSize: 12, marginTop: 5 },
    flex: { flex: 1 },
    productCard: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, padding: 15, borderRadius: 12, marginBottom: 12, ...SHADOWS.light },
    productThumb: { width: 64, height: 64, borderRadius: 10, marginRight: 12, resizeMode: "cover" },
    prodName: { fontWeight: "bold", fontSize: 16, color: COLORS.secondary },
    prodPrice: { color: COLORS.primary, fontWeight: "bold", marginTop: 2 },
    qtyRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    qtyValue: { fontSize: 18, fontWeight: "bold", width: 25, textAlign: "center" },
    summaryFooter: { padding: 20, backgroundColor: COLORS.white, borderRadius: 15, marginBottom: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    totalLabel: { fontSize: 16, color: COLORS.textLight },
    totalVal: { fontSize: 24, fontWeight: "bold", color: COLORS.primary },
    btnRow: { flexDirection: "row" },
    confirmScroll: { flex: 1 },
    confirmCard: { backgroundColor: COLORS.white, padding: 20, borderRadius: 20, ...SHADOWS.medium, marginBottom: 20 },
    confirmHeader: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: COLORS.secondary },
    confirmRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
    confirmText: { fontSize: 16, color: COLORS.text },
    confirmSub: { fontWeight: "bold", marginTop: 15, marginBottom: 8 },
    confirmItem: { fontSize: 14, color: COLORS.textLight, marginBottom: 4 },
    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 15 },
    confirmTotal: { fontSize: 22, fontWeight: "bold", color: COLORS.primary, textAlign: "center" }
});
