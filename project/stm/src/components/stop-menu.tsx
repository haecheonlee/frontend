"use client";

import { useStop } from "@/context/stop-context";
import { Stops } from "@/types/gtfs";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

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
            <StopList stops={value.relatedStops} />
        </div>
    );
}

function StopList({ stops }: { stops: ReadonlyArray<Stops> }) {
    if (!stops.length) {
        return null;
    }

    return (
        <ScrollArea>
            {stops.map((p) => (
                <div className="p-1" key={p.stop_id}>
                    <StopCard stop={p} />
                </div>
            ))}
        </ScrollArea>
    );
}

function StopCard({ stop }: { stop: Readonly<Stops> }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{stop.stop_code}</CardTitle>
                <CardDescription>{stop.stop_name}</CardDescription>
            </CardHeader>
        </Card>
    );
}
