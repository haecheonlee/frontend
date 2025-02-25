"use client";

import { Routes } from "@/types/gtfs";
import RoutesCard from "./routes-card";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { useState } from "react";

interface RouteListProps {
    readonly routesList: readonly Routes[];
}

export default function RoutesList({ routesList }: Readonly<RouteListProps>) {
    const [searchText, setSearchText] = useState("");

    const filteredRoutes = routesList.filter(
        (p) =>
            !searchText ||
            p.route_long_name
                ?.toLowerCase()
                .includes(searchText.toLowerCase().trim())
    );

    return (
        <>
            <div className="h-full w-full rounded-md border flex flex-col">
                <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">
                        Routes
                    </h4>
                    <Input
                        placeholder="Search routes"
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                    />
                </div>
                <ScrollArea className="w-full px-4 pb-4">
                    <>
                        {filteredRoutes.map((routes) => (
                            <RoutesCard routes={routes} key={routes.route_id} />
                        ))}
                    </>
                </ScrollArea>
            </div>
        </>
    );
}
