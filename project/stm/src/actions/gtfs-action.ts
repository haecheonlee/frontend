import { db } from "@/db/drizzle";
import { stop_times } from "@/db/schema";
import { aliasedTable, eq } from "drizzle-orm";

export const getRelatedStopIdsByStopId = async (
    stopId: string
): Promise<ReadonlyArray<{ stop_id: string }>> => {
    const related_stop_times = aliasedTable(stop_times, "related_stop_times");

    return await db
        .selectDistinct({ stop_id: related_stop_times.stop_id })
        .from(stop_times)
        .innerJoin(
            related_stop_times,
            eq(related_stop_times.trip_id, stop_times.trip_id)
        )
        .where(eq(stop_times.stop_id, stopId));
};
