import { Routes } from "@/types/gtfs";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { useRoutes } from "@/context/RoutesContext";
import clsx from "clsx";

interface RoutesCardProps {
    readonly routes: Readonly<Routes>;
}

export default function RoutesCard({ routes }: Readonly<RoutesCardProps>) {
    const { routes: selectedRoutes, setRoutes } = useRoutes();

    const isRoutesSelected = routes.route_id === selectedRoutes?.route_id;

    const onClick = () => {
        if (isRoutesSelected) {
            return;
        }

        setRoutes(routes);
    };

    return (
        <Card
            className={clsx("my-2 w-[215px]", {
                "bg-gray-100": isRoutesSelected,
                "cursor-pointer hover:bg-gray-100": !isRoutesSelected,
            })}
            onClick={onClick}
        >
            <CardHeader>
                <CardTitle>{routes.route_short_name}</CardTitle>
                <CardDescription>{routes.route_long_name}</CardDescription>
            </CardHeader>
        </Card>
    );
}
