"use client";

import { useStop } from "@/context/stop-context";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export default function StopMenu() {
    const { value, setValue } = useStop();

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
    };

    return (
        <div className="h-full overflow-auto">
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
