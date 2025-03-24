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
import { and, eq, inArray, or } from "drizzle-orm";

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
    const currentStopsRoutes = !stopId
        ? []
        : await db
              .selectDistinct({
                  direction_id: trips.direction_id,
                  route_id: routes.route_id,
                  agency_id: routes.agency_id,
                  route_short_name: routes.route_short_name,
                  route_long_name: routes.route_long_name,
                  route_type: routes.route_type,
                  route_url: routes.route_url,
                  route_color: routes.route_color,
                  route_text_color: routes.route_text_color,
              })
              .from(routes)
              .innerJoin(trips, eq(trips.route_id, routes.route_id))
              .innerJoin(stop_times, eq(stop_times.trip_id, trips.trip_id))
              .where(eq(stop_times.stop_id, stopId));

    const relatedStops: ReadonlyArray<Stops> = !currentStopsRoutes.length
        ? []
        : await db
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
              .innerJoin(stops, eq(stops.stop_id, stop_times.stop_id))
              .innerJoin(trips, eq(trips.trip_id, stop_times.trip_id))
              .innerJoin(routes, eq(routes.route_id, trips.route_id))
              .where(
                  or(
                      ...currentStopsRoutes.map(({ route_id, direction_id }) =>
                          and(
                              eq(routes.route_id, route_id),
                              eq(trips.direction_id, direction_id)
                          )
                      )
                  )
              );

    const stopIds = relatedStops.map((stop) => stop.stop_id);
    const relationalRoutesByStops = !stopIds.length
        ? []
        : await db
              .selectDistinct({
                  route_id: routes.route_id,
                  stop_id: stop_times.stop_id,
              })
              .from(routes)
              .innerJoin(trips, eq(trips.route_id, routes.route_id))
              .innerJoin(stop_times, eq(stop_times.trip_id, trips.trip_id))
              .where(inArray(stop_times.stop_id, stopIds));

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
        routes: currentStopsRoutes,
        routesDictionary,
    };
};
