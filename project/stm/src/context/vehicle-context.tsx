"use client";

import { VehiclePosition } from "@/types/vehicle-position";
import React, {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useState,
} from "react";

type VehicleContextValue = {
    vehicles: ReadonlyArray<VehiclePosition>;
    setVehicles: Dispatch<SetStateAction<VehicleContextValue["vehicles"]>>;
};

const VehicleContext = createContext<VehicleContextValue | undefined>(
    undefined
);

export function VehicleProvider({
    children,
}: React.PropsWithChildren<unknown>) {
    const [vehicles, setVehicles] = useState<ReadonlyArray<VehiclePosition>>(
        []
    );

    return (
        <VehicleContext.Provider value={{ vehicles, setVehicles }}>
            {children}
        </VehicleContext.Provider>
    );
}

export function useVehicle() {
    const context = useContext(VehicleContext);

    if (!context) {
        throw new Error("useVehicle must be used within VehicleContext");
    }

    return context;
}
