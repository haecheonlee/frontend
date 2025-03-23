"use client";

import { Routes } from "@/types/gtfs";
import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useState,
} from "react";

type RoutesContextValue = {
    routes: ReadonlyArray<Routes>;
    setRoutes: Dispatch<SetStateAction<RoutesContextValue["routes"]>>;
    routesDictionary: Record<string, ReadonlyArray<string>>;
    setRoutesDictionary: Dispatch<
        SetStateAction<RoutesContextValue["routesDictionary"]>
    >;
    selectedRoutes: Readonly<Routes> | null;
    setSelectedRoutes: Dispatch<
        SetStateAction<RoutesContextValue["selectedRoutes"]>
    >;
};

const RoutesContext = createContext<RoutesContextValue | undefined>(undefined);

export function RoutesProvider({ children }: React.PropsWithChildren) {
    const [routes, setRoutes] = useState<RoutesContextValue["routes"]>([]);
    const [routesDictionary, setRoutesDictionary] = useState<
        RoutesContextValue["routesDictionary"]
    >({});
    const [selectedRoutes, setSelectedRoutes] =
        useState<RoutesContextValue["selectedRoutes"]>(null);

    return (
        <RoutesContext.Provider
            value={{
                routes,
                setRoutes,
                routesDictionary,
                setRoutesDictionary,
                selectedRoutes,
                setSelectedRoutes,
            }}
        >
            {children}
        </RoutesContext.Provider>
    );
}

export function useRoutes() {
    const context = useContext(RoutesContext);

    if (context === undefined) {
        throw new Error("useRoutes must be used within RoutesProvider.");
    }

    return context;
}
