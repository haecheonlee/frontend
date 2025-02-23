import { Routes } from "@/types/gtfs";
import RoutesCard from "./routes-card";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";

interface RouteListProps {
    readonly routesList: readonly Routes[];
}

export default function RoutesList({ routesList }: Readonly<RouteListProps>) {
    return (
        <>
            <ScrollArea className="h-full w-full rounded-md border">
                <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">
                        Routes
                    </h4>
                    <Input placeholder="Search routes" />
                    <>
                        {routesList.map((routes) => (
                            <RoutesCard routes={routes} key={routes.route_id} />
                        ))}
                    </>
                </div>
            </ScrollArea>
        </>
    );
}
