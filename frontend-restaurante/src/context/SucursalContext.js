import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import sucursalService from "../services/sucursalService";

const SucursalContext = createContext(null);
const STORAGE_KEY = "idSucursalActiva";

export function SucursalProvider({ children }) {
    const [sucursales, setSucursales] = useState([]);
    const [idSucursal, setIdSucursalState] = useState(null);
    const [cargandoSucursales, setCargandoSucursales] = useState(true);

    useEffect(() => {
        async function cargar() {
            try {
                const [datos, guardada] = await Promise.all([
                    sucursalService.listar(),
                    AsyncStorage.getItem(STORAGE_KEY)
                ]);
                const activas = datos.filter((item) => item.activo);
                const idGuardado = Number(guardada);
                const seleccion = activas.find((item) => item.idSucursal === idGuardado) || activas[0];
                setSucursales(activas);
                setIdSucursalState(seleccion?.idSucursal || null);
            } finally {
                setCargandoSucursales(false);
            }
        }
        cargar();
    }, []);

    async function seleccionarSucursal(id) {
        const valor = Number(id);
        setIdSucursalState(valor);
        await AsyncStorage.setItem(STORAGE_KEY, String(valor));
    }

    const value = useMemo(() => ({
        sucursales,
        idSucursal,
        seleccionarSucursal,
        cargandoSucursales
    }), [sucursales, idSucursal, cargandoSucursales]);

    return <SucursalContext.Provider value={value}>{children}</SucursalContext.Provider>;
}

export function useSucursal() {
    const context = useContext(SucursalContext);
    if (!context) throw new Error("useSucursal debe usarse dentro de SucursalProvider.");
    return context;
}
