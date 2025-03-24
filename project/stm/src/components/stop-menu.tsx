"use client";

import { useStop } from "@/context/stop-context";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useRoutes } from "@/context/routes-context";

export default function StopMenu() {
    const { value, setValue } = useStop();
    const { setRoutes, setRoutesDictionary, setSelectedRoutes } = useRoutes();

    if (!value.stop) {
        return (
            <Card>
                <CardHeader>
                    <CardDescription>Choose a stop</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const reset = () => {
        setValue({ stop: null });
        setRoutes([]);
        setRoutesDictionary({});
        setSelectedRoutes(null);
    };

    return (
        <div className="overflow-auto mb-[5px]">
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        {value.stop.stop_code}
                        <Button variant="outline" onClick={reset}>
                            Reset
                        </Button>
                    </CardTitle>
                    <CardDescription>{value.stop.stop_name}</CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}
