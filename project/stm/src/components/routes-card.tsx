import { Routes } from "@/types/gtfs";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";

interface RoutesCardProps {
    routes: Readonly<Routes>;
}

export default function RoutesCard({ routes }: Readonly<RoutesCardProps>) {
    return (
        <Card className="my-2">
            <CardHeader>
                <CardTitle>{routes.route_short_name}</CardTitle>
                <CardDescription>{routes.route_long_name}</CardDescription>
            </CardHeader>
        </Card>
    );
}
