"use client";

import { dbClient } from "@/api/clients";
import { Stops, Trips } from "@/types/gtfs";
import { createContext, useContext, useEffect, useState } from "react";

interface GtfsContextType {
    stops: ReadonlyArray<Stops>;
    trips: ReadonlyArray<Trips>;
}

const GtfsContext = createContext<GtfsContextType | undefined>(undefined);

export function GtfsProvider({ children }: React.PropsWithChildren) {
    const [data, setData] = useState<GtfsContextType>({
        stops: [],
        trips: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            const result = await dbClient<GtfsContextType>("data");
            setData(result);
        };

        fetchData();
    }, []);

    return <GtfsContext.Provider value={data}>{children}</GtfsContext.Provider>;
}

export function useGtfs(): GtfsContextType {
    const context = useContext(GtfsContext);

    if (context === undefined) {
        throw new Error("useGtfs must be used within a GtfsProvider");
    }

    return context;
}
