"use client";

import { usePathname } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext<{ previousUrls: string[] }>({
    previousUrls: [],
});

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [previousUrls, setPreviousUrls] = useState<string[]>([]);
    const pathname = usePathname();

    useEffect(() => {
        setPreviousUrls((urls) => {
            const array = urls.at(-1) === pathname ? urls : [...urls, pathname];
            return array.length === 10 ? array.slice(1) : array;
        });
    }, [pathname]);

    return (
        <AppContext.Provider value={{ previousUrls }}>
            {children}
        </AppContext.Provider>
    );
}
