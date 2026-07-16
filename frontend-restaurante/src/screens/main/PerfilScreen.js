import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { logout } from "../../services/authService";
import sucursalService from "../../services/sucursalService";
import { COLORS, SIZES, SHADOWS } from "../../constants/theme";
import CustomButton from "../../components/CustomButton";
import { useSucursal } from "../../context/SucursalContext";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function PerfilScreen({ usuario, onLogout }) {
    const { sucursales, idSucursal, seleccionarSucursal, cargandoSucursales } = useSucursal();
    const [horarios, setHorarios] = useState([]);
    const [loading, setLoading] = useState(true);

    const [picker, setPicker] = useState({ visible: false, dayIndex: null, field: null, date: new Date() });

    useEffect(() => {
        if (!idSucursal) {
            if (!cargandoSucursales) setLoading(false);
            return;
        }
        sucursalService.listarHorarios(idSucursal).then((datos) => {
            setHorarios(DIAS.map((_, index) => {
                const actual = datos.find((item) => item.diaSemana === index + 1);
                return actual || {
                    diaSemana: index + 1,
                    horaApertura: "09:00",
                    horaCierre: "18:00",
                    horaApertura2: "",
                    horaCierre2: "",
                    cerrado: false
                };
            }));
        }).finally(() => setLoading(false));
    }, [idSucursal, cargandoSucursales]);

    function openPicker(index, field, currentValue) {
        const d = new Date();
        if (currentValue) {
            const [h, m] = currentValue.split(':');
            d.setHours(h, m);
        }
        setPicker({ visible: true, dayIndex: index, field, date: d });
    }

    function onPickerChange(event, selectedDate) {
        setPicker(p => ({ ...p, visible: false }));
        if (selectedDate && picker.dayIndex !== null) {
            const timeStr = selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            setHorarios(actuales => actuales.map((item, i) =>
                i === picker.dayIndex ? { ...item, [picker.field]: timeStr } : item
            ));
        }
    }

    async function guardar() {
        try {
            await sucursalService.guardarHorarios(idSucursal, horarios);
            Alert.alert("Éxito", "Horarios actualizados.");
        } catch (error) {
            Alert.alert("Error", "No se pudieron guardar los cambios.");
        }
    }

    if (loading || cargandoSucursales) return <ActivityIndicator style={{flex:1}} color={COLORS.primary}/>;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{usuario.nombre[0]}</Text></View>
                <Text style={styles.userName}>{usuario.nombre} {usuario.apellido}</Text>
                <Text style={styles.userEmail}>{usuario.email}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Configuración de Local</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.branchScroll}>
                    {sucursales.map(s => (
                        <TouchableOpacity
                            key={s.idSucursal}
                            style={[styles.branchTab, idSucursal === s.idSucursal && styles.branchTabActive]}
                            onPress={() => seleccionarSucursal(s.idSucursal)}
                        >
                            <Text style={[styles.branchTabText, idSucursal === s.idSucursal && { color: COLORS.black }]}>{s.nombre}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Horarios de Atención</Text>
                {horarios.map((h, i) => (
                    <View key={i} style={styles.dayCard}>
                        <View style={styles.dayHeader}>
                            <Text style={styles.dayName}>{DIAS[i]}</Text>
                            <Switch
                                value={!h.cerrado}
                                onValueChange={(val) => setHorarios(cur => cur.map((item, idx) => idx === i ? { ...item, cerrado: !val } : item))}
                                trackColor={{ true: COLORS.primary }}
                            />
                        </View>
                        {!h.cerrado && (
                            <View>
                            <View style={styles.timeInputs}>
                                <TouchableOpacity style={styles.timeBox} onPress={() => openPicker(i, 'horaApertura', h.horaApertura)}>
                                    <Text style={styles.timeValue}>{h.horaApertura?.slice(0,5) || "00:00"}</Text>
                                </TouchableOpacity>
                                <Text style={{color: COLORS.white}}>a</Text>
                                <TouchableOpacity style={styles.timeBox} onPress={() => openPicker(i, 'horaCierre', h.horaCierre)}>
                                    <Text style={styles.timeValue}>{h.horaCierre?.slice(0,5) || "00:00"}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.splitLabel}>Segundo turno (opcional)</Text>
                            <View style={styles.timeInputs}>
                                <TouchableOpacity style={styles.timeBox} onPress={() => openPicker(i, 'horaApertura2', h.horaApertura2)}>
                                    <Text style={styles.timeValue}>{h.horaApertura2?.slice(0,5) || "--:--"}</Text>
                                </TouchableOpacity>
                                <Text style={{color: COLORS.white}}>a</Text>
                                <TouchableOpacity style={styles.timeBox} onPress={() => openPicker(i, 'horaCierre2', h.horaCierre2)}>
                                    <Text style={styles.timeValue}>{h.horaCierre2?.slice(0,5) || "--:--"}</Text>
                                </TouchableOpacity>
                            </View>
                            </View>
                        )}
                    </View>
                ))}
                <CustomButton title="Guardar Horarios" onPress={guardar} style={{ marginTop: 20 }} />
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            {picker.visible && (
                <DateTimePicker
                    value={picker.date}
                    mode="time"
                    is24Hour={true}
                    display="clock"
                    onChange={onPickerChange}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { alignItems: "center", padding: 30, backgroundColor: COLORS.surface },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", marginBottom: 15 },
    avatarText: { fontSize: 32, fontWeight: "bold", color: COLORS.black },
    userName: { fontSize: 22, fontWeight: "bold", color: COLORS.white },
    userEmail: { color: COLORS.textLight, marginTop: 4 },
    section: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.primary, marginBottom: 15 },
    branchScroll: { flexDirection: "row" },
    branchTab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: COLORS.surface, marginRight: 10, borderWidth: 1, borderColor: COLORS.border },
    branchTabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    branchTabText: { color: COLORS.textLight, fontWeight: "bold" },
    dayCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 15, marginBottom: 10 },
    dayHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    dayName: { fontSize: 16, fontWeight: "bold", color: COLORS.white },
    timeInputs: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
    timeBox: { flex: 1, backgroundColor: "#333", padding: 10, borderRadius: 8, alignItems: "center" },
    timeValue: { color: COLORS.primary, fontWeight: "bold", fontSize: 16 },
    splitLabel: { color: COLORS.textLight, fontSize: 12, marginTop: 12 },
    logoutBtn: { margin: 30, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: COLORS.error, alignItems: "center" },
    logoutText: { color: COLORS.error, fontWeight: "bold" }
});
