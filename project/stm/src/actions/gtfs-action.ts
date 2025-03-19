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
import { aliasedTable, eq } from "drizzle-orm";

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

export const getRelatedStopIdsByStopId = async (
    stopId: string
): Promise<Readonly<{ stopIds: ReadonlyArray<string>; tripId: string }>> => {
    const related_stop_times = aliasedTable(stop_times, "related_stop_times");

    const stopIds = await db
        .selectDistinct({ stop_id: related_stop_times.stop_id })
        .from(stop_times)
        .innerJoin(
            related_stop_times,
            eq(related_stop_times.trip_id, stop_times.trip_id)
        )
        .where(eq(stop_times.stop_id, stopId));

    const routeIds = await db
        .select({ trip_id: stop_times.trip_id })
        .from(stop_times)
        .where(eq(stop_times.stop_id, stopId));

    return {
        stopIds: stopIds.map((p) => p.stop_id),
        tripId: routeIds[0].trip_id,
    };
};
