"use client";

import { Stops } from "@/types/gtfs";
import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useState,
} from "react";

type StopsContextType = {
    stop: Readonly<Stops> | null;
};

interface StopsContextValue {
    value: StopsContextType;
    setValue: Dispatch<SetStateAction<StopsContextType>>;
}

const StopContext = createContext<StopsContextValue | undefined>(undefined);

export function StopProvider({ children }: React.PropsWithChildren) {
    const [value, setValue] = useState<StopsContextType>({
        stop: null,
    });

    return (
        <StopContext.Provider value={{ value, setValue }}>
            {children}
        </StopContext.Provider>
    );
}

export function useStop() {
    const context = useContext(StopContext);

    if (context === undefined) {
        throw new Error("useStop must be used within StopProvider");
    }

    return context;
}
