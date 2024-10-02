"use client";

import { usePathname } from "next/navigation";
import {
    createContext,
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
} from "react";

const MAX_SIZE = 3;

export const AppContext = createContext<{
    previousUrls: string[];
    forceToRenderSidebar: boolean;
    setForceToRenderSidebar: Dispatch<SetStateAction<boolean>>;
}>({
    previousUrls: [],
    forceToRenderSidebar: false,
    setForceToRenderSidebar: () => null,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [previousUrls, setPreviousUrls] = useState<string[]>([]);
    const [forceToRenderSidebar, setForceToRenderSidebar] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setPreviousUrls((urls) => {
            const array = urls.at(-1) === pathname ? urls : [...urls, pathname];
            return array.length === MAX_SIZE ? array.slice(1) : array;
        });
    }, [pathname]);

    return (
        <AppContext.Provider
            value={{
                previousUrls,
                forceToRenderSidebar,
                setForceToRenderSidebar,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
