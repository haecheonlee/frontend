import { db } from "@/db/drizzle";
import { stop_times } from "@/db/schema";
import { aliasedTable, eq } from "drizzle-orm";

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
