"use client";

import { useStop } from "@/context/stop-context";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function StopMenu() {
    const { value } = useStop();

    if (!value.stop) {
        return (
            <Card>
                <CardHeader>
                    <CardDescription>Choose a stop</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="h-full overflow-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{value.stop.stop_code}</CardTitle>
                    <CardDescription>{value.stop.stop_name}</CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}
