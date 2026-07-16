import React, { createContext, useContext, useMemo, useState } from "react";

const RefreshContext = createContext(null);

export function RefreshProvider({ children }) {
    const [refreshKey, setRefreshKey] = useState(0);
    const value = useMemo(() => ({
        refreshKey,
        refresh: () => setRefreshKey((current) => current + 1)
    }), [refreshKey]);

    return <RefreshContext.Provider value={value}>{children}</RefreshContext.Provider>;
}

export function useGlobalRefresh() {
    const context = useContext(RefreshContext);
    if (!context) {
        throw new Error("useGlobalRefresh debe usarse dentro de RefreshProvider.");
    }
    return context;
}
