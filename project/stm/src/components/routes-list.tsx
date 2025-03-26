import { ScrollArea } from "./ui/scroll-area";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { useRoutes } from "@/context/routes-context";
import { RoutesWithDirectionId } from "@/types/gtfs";
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

    const areRoutesEqual = (
        a: RoutesWithDirectionId,
        b: RoutesWithDirectionId
    ) => {
        return a.route_id === b.route_id && a.direction_id === b.direction_id;
    };

    const onClick = (route: Readonly<RoutesWithDirectionId>) => {
        if (!selectedRoutes || !areRoutesEqual(selectedRoutes, route)) {
            setSelectedRoutes(route);
        } else {
            setSelectedRoutes(null);
        }
    };

    return (
        <ScrollArea className="overflow-auto">
            {sortedRoutes.map((p) => (
                <div key={p.route_id + p.direction_id}>
                    <Card
                        className={clsx("mb-[5px] cursor-pointer", {
                            "bg-gray-200":
                                selectedRoutes &&
                                areRoutesEqual(selectedRoutes, p),
                        })}
                        onClick={onClick.bind(null, p)}
                    >
                        <CardHeader>
                            <CardTitle>{`${p.route_short_name} - ${
                                p.direction_id === 0 ? "Out" : "In"
                            }`}</CardTitle>
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
