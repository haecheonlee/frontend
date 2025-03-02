import { StopTimes } from "@/types/gtfs";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const stop_times = sqliteTable("stop_times", {
    trip_id: text("trip_id").notNull(),
    arrival_time: text("arrival_time"),
    departure_time: text("departure_time"),
    stop_id: text("stop_id"),
    stop_sequence: text("stop_sequence").notNull(),
} as Record<keyof StopTimes, ReturnType<typeof text>>);
