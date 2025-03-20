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
import { Stops } from "@/types/gtfs";
import { aliasedTable, and, eq, ne } from "drizzle-orm";

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
): Promise<Readonly<{ stops: ReadonlyArray<Stops>; routeId: string }>> => {
    const related_stop_times = aliasedTable(stop_times, "related_stop_times");

    const relatedStops = await db
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
        .where(and(eq(stop_times.stop_id, stopId), ne(stops.stop_id, stopId)));

    const [{ route_id }] = await db
        .select({ route_id: trips.route_id })
        .from(stop_times)
        .innerJoin(trips, eq(trips.trip_id, stop_times.trip_id))
        .where(eq(stop_times.stop_id, stopId))
        .limit(1);

    return {
        stops: relatedStops,
        routeId: route_id,
    };
};
