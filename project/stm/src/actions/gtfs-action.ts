import { db } from "@/db/drizzle";
import {
    agencies,
    calendar,
    calendar_dates,
    feed_info,
    routes,
    shapes,
    stop_times,
    stops,
    trips,
} from "@/db/schema";
import { GtfsType } from "@/types/api";
import { Routes, Stops } from "@/types/gtfs";
import { aliasedTable, eq, inArray } from "drizzle-orm";

export const getData = async (type: GtfsType) => {
    let table = null;

    switch (type) {
        case "agency":
            table = agencies;
            break;
        case "calendar":
            table = calendar;
            break;
        case "calendarDates":
            table = calendar_dates;
            break;
        case "feedInfo":
            table = feed_info;
            break;
        case "routes":
            table = routes;
            break;
        case "shapes":
            table = shapes;
            break;
        case "stopTimes":
            table = stop_times;
            break;
        case "stops":
            table = stops;
            break;
        case "trips":
            table = trips;
            break;
    }

    return await db.select().from(table);
};

export const getStopsByStopId = async (
    stopId: string
): Promise<
    Readonly<{
        stops: ReadonlyArray<Stops>;
        routes: ReadonlyArray<Routes>;
        routesDictionary: Record<string, ReadonlyArray<string>>;
    }>
> => {
    const related_stop_times = aliasedTable(stop_times, "related_stop_times");

    const relatedStops: ReadonlyArray<Stops> = await db
        .selectDistinct({
            stop_id: stops.stop_id,
            stop_code: stops.stop_code,
            stop_name: stops.stop_name,
            stop_lat: stops.stop_lat,
            stop_lon: stops.stop_lon,
            stop_url: stops.stop_url,
            location_type: stops.location_type,
            parent_station: stops.parent_station,
            wheelchair_boarding: stops.wheelchair_boarding,
        })
        .from(stop_times)
        .innerJoin(
            related_stop_times,
            eq(related_stop_times.trip_id, stop_times.trip_id)
        )
        .innerJoin(trips, eq(trips.trip_id, related_stop_times.trip_id))
        .innerJoin(stops, eq(stops.stop_id, related_stop_times.stop_id))
        .where(eq(stop_times.stop_id, stopId));

    const relationalRoutesByStops = await db
        .selectDistinct({
            route_id: routes.route_id,
            stop_id: stop_times.stop_id,
        })
        .from(routes)
        .innerJoin(trips, eq(trips.route_id, routes.route_id))
        .innerJoin(stop_times, eq(stop_times.trip_id, trips.trip_id))
        .where(
            inArray(
                stop_times.stop_id,
                relatedStops.map((p) => p.stop_id)
            )
        );

    const currentStopsRouteId = relationalRoutesByStops.find(
        (p) => p.stop_id === stopId
    )?.route_id;
    const currentStopsRoutes = !currentStopsRouteId
        ? []
        : await db
              .select()
              .from(routes)
              .where(eq(routes.route_id, currentStopsRouteId));

    const routesDictionary = relationalRoutesByStops.reduce<
        Record<string, string[]>
    >((acc, value) => {
        const { route_id, stop_id } = value;

        if (!acc[stop_id]) {
            acc[stop_id] = [];
        }

        acc[stop_id].push(route_id);
        return acc;
    }, {});

    return {
        stops: relatedStops,
        routesDictionary: routesDictionary,
        routes: currentStopsRoutes,
    };
};
