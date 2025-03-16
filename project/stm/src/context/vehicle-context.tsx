"use client";

import { stmClient } from "@/api/clients";
import { VehiclePosition } from "@/types/vehicle-position";
import React, {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
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

    useEffect(() => {
        const fetchVehicles = async () => {
            const data = await stmClient("vehiclePositions");
            setVehicles(data ?? []);
        };

        fetchVehicles();

        const delayInMs = 1000 * 60; // 1 minute;
        const intervalId = setInterval(fetchVehicles, delayInMs);

        return () => clearInterval(intervalId);
    }, []);

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
