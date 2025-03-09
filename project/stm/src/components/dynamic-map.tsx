"use client";

import dynamic from "next/dynamic";

const DynamicallyLoadedMap = dynamic(() => import("./map"), {
    loading: () => null,
    ssr: false,
});

export default function DynamicMap() {
    return <DynamicallyLoadedMap />;
}
