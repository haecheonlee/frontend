import { db } from "@/db/drizzle";
import { stop_times } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getStopTimesByTripId = async (
    tripId: string
): Promise<ReadonlyArray<{ stop_id: string }>> => {
    return await db
        .select({ stop_id: stop_times.stop_id })
        .from(stop_times)
        .where(eq(stop_times.trip_id, tripId));
};
