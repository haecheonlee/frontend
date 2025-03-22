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
    routeIds: ReadonlyArray<string>;
    setRouteIds: Dispatch<SetStateAction<VehicleContextValue["routeIds"]>>;
};

const VehicleContext = createContext<VehicleContextValue | undefined>(
    undefined
);

export function VehicleProvider({
    children,
}: React.PropsWithChildren<unknown>) {
    const [vehicles, setVehicles] = useState<VehicleContextValue["vehicles"]>(
        []
    );
    const [routeIds, setRouteIds] = useState<VehicleContextValue["routeIds"]>(
        []
    );

    useEffect(() => {
        const fetchVehicles = async () => {
            const data = await stmClient("vehiclePositions");
            setVehicles(data ?? []);
        };

        fetchVehicles();

        const delayInMs = 1000 * 60 * 10; // 10 minutes;
        const intervalId = setInterval(fetchVehicles, delayInMs);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <VehicleContext.Provider
            value={{
                vehicles,
                setVehicles,
                routeIds,
                setRouteIds,
            }}
        >
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
