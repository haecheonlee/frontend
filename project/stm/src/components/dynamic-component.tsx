"use client";

import dynamic from "next/dynamic";

const DynamicallyLoadedMap = dynamic(() => import("./map"), {
    loading: () => null,
    ssr: false,
});

const DynamicallyLoadedStopMenu = dynamic(() => import("./stop-menu"), {
    loading: () => null,
    ssr: false,
});

export function DynamicMap() {
    return <DynamicallyLoadedMap />;
}

export function DynamicStopMenu() {
    return <DynamicallyLoadedStopMenu />;
}
