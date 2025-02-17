import { db } from "@/db/drizzle";
import { stop_times, stops } from "@/db/schema";
import { Stops } from "@/types/gtfs";
import { eq, getTableColumns } from "drizzle-orm";

export const getStopsByTripId = async (
    tripId: string
): Promise<ReadonlyArray<Readonly<Stops>>> => {
    return await db
        .select({ ...getTableColumns(stops) })
        .from(stops)
        .innerJoin(stop_times, eq(stops.stop_id, stop_times.stop_id))
        .where(eq(stop_times.trip_id, tripId));
};
