"use client";

import {
    Agency,
    Calendar,
    CalendarDates,
    FeedInfo,
    Routes,
    Shapes,
    Stops,
    Trips,
} from "@/types/gtfs";
import { createContext, useContext, useMemo } from "react";

interface GtfsContextType {
    agency: ReadonlyArray<Agency>;
    calendarDate: ReadonlyArray<CalendarDates>;
    calendar: ReadonlyArray<Calendar>;
    feedInfo: ReadonlyArray<FeedInfo>;
    routes: ReadonlyArray<Routes>;
    shapes: ReadonlyArray<Shapes>;
    stops: ReadonlyArray<Stops>;
    trips: ReadonlyArray<Trips>;
}

const GtfsContext = createContext<GtfsContextType | undefined>(undefined);

export function GtfsProvider({
    data,
    children,
}: React.PropsWithChildren<{ data: Readonly<GtfsContextType> }>) {
    const contextValue = useMemo<GtfsContextType>(
        () =>
            Object.freeze({
                ...data,
            }),
        [data]
    );

    return (
        <GtfsContext.Provider value={contextValue}>
            {children}
        </GtfsContext.Provider>
    );
}

export function useGtfs(): GtfsContextType {
    const context = useContext(GtfsContext);

    if (context === undefined) {
        throw new Error("useGtfs must be used within a GtfsProvider");
    }

    return context;
}
