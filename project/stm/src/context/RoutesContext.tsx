// context/ThemeContext.tsx
"use client";

import { Routes } from "@/types/gtfs";
import { createContext, useContext, useState, ReactNode } from "react";

interface RoutesContextType {
    readonly routes: Readonly<Routes> | null;
    readonly setRoutes: (routes: Readonly<Routes>) => void;
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

export const RoutesProvider = ({
    children,
}: Readonly<{ children: ReactNode }>) => {
    const [routes, setRoutes] = useState<RoutesContextType["routes"]>(null);

    return (
        <RoutesContext.Provider value={{ routes, setRoutes }}>
            {children}
        </RoutesContext.Provider>
    );
};

export const useRoutes = () => {
    const context = useContext(RoutesContext);

    if (!context) {
        throw new Error("useRoutes must be used within a RoutesProvider.");
    }

    return context;
};
