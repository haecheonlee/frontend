import { ScrollArea } from "./ui/scroll-area";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { useRoutes } from "@/context/routes-context";
import { Routes } from "@/types/gtfs";
import clsx from "clsx";
import { useMemo } from "react";

export default function RoutesList() {
    const { routes, selectedRoutes, setSelectedRoutes } = useRoutes();

    const sortedRoutes = useMemo(() => {
        return routes.toSorted(
            (a, b) => Number(a.route_id) - Number(b.route_id)
        );
    }, [routes]);

    if (!routes.length) {
        return null;
    }

    const onClick = (route: Readonly<Routes>) => {
        if (!selectedRoutes || selectedRoutes.route_id !== route.route_id) {
            setSelectedRoutes(route);
        } else {
            setSelectedRoutes(null);
        }
    };

    return (
        <ScrollArea className="overflow-auto">
            {sortedRoutes.map((p) => (
                <div key={p.route_id}>
                    <Card
                        className={clsx("mb-[5px] cursor-pointer", {
                            "bg-gray-200":
                                selectedRoutes?.route_id === p.route_id,
                        })}
                        onClick={onClick.bind(null, p)}
                    >
                        <CardHeader>
                            <CardTitle>{p.route_short_name}</CardTitle>
                            <CardDescription>
                                {p.route_long_name}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            ))}
        </ScrollArea>
    );
}
