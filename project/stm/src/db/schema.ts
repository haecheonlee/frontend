import {
    Agency,
    Calendar,
    CalendarDates,
    FeedInfo,
    Routes,
    Shapes,
    Stops,
    StopTimes,
    Trips,
} from "@/types/gtfs";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const agencies = sqliteTable("agencies", {
    agency_id: text("agency_id").primaryKey().notNull(),
    agency_name: text("agency_name").notNull(),
    agency_url: text("agency_url").notNull(),
    agency_timezone: text("agency_timezone").notNull(),
    agency_lang: text("agency_lang"),
    agency_phone: text("agency_phone"),
    agency_fare_url: text("agency_fare_url"),
    agency_email: text("agency_email"),
} as Record<keyof Agency, ReturnType<typeof text>>);

export const calendar = sqliteTable("calendar", {
    service_id: text("service_id").notNull(),
    monday: text("monday").notNull(),
    tuesday: text("tuesday").notNull(),
    wednesday: text("wednesday").notNull(),
    thursday: text("thursday").notNull(),
    friday: text("friday").notNull(),
    saturday: text("saturday").notNull(),
    sunday: text("sunday").notNull(),
    start_date: text("start_date").notNull(),
    end_date: text("end_date").notNull(),
} as Record<keyof Calendar, ReturnType<typeof text>>);

export const calendar_dates = sqliteTable("calendar_dates", {
    service_id: text("service_id").notNull(),
    date: text("date").notNull(),
    exception_type: text("exception_type").notNull(),
} as Record<keyof CalendarDates, ReturnType<typeof text>>);

export const feed_info = sqliteTable("feed_info", {
    feed_publisher_name: text("feed_publisher_name").notNull(),
    feed_publisher_url: text("feed_publisher_url").notNull(),
    feed_lang: text("feed_lang").notNull(),
    feed_start_date: text("feed_start_date"),
    feed_end_date: text("feed_end_date"),
} as Record<keyof FeedInfo, ReturnType<typeof text>>);

export const routes = sqliteTable("routes", {
    route_id: text("route_id").notNull(),
    agency_id: text("agency_id"),
    route_short_name: text("route_short_name"),
    route_long_name: text("route_long_name"),
    route_type: text("route_type").notNull(),
    route_url: text("route_url"),
    route_color: text("route_color"),
    route_text_color: text("route_text_color"),
} as Record<keyof Routes, ReturnType<typeof text>>);

export const shapes = sqliteTable("shapes", {
    shape_id: text("shape_id").notNull(),
    shape_pt_lat: text("shape_pt_lat").notNull(),
    shape_pt_lon: text("shape_pt_lon").notNull(),
    shape_pt_sequence: text("shape_pt_sequence").notNull(),
} as Record<keyof Shapes, ReturnType<typeof text>>);

export const stops = sqliteTable("stops", {
    stop_id: text("stop_id").notNull(),
    stop_code: text("stop_code"),
    stop_name: text("stop_name"),
    stop_desc: text("stop_desc"),
    stop_lat: text("stop_lat"),
    stop_lon: text("stop_lon"),
    zone_id: text("zone_id"),
    stop_url: text("stop_url"),
    location_type: text("location_type"),
    parent_station: text("parent_station"),
    wheelchair_boarding: text("wheelchair_boarding"),
} as Record<keyof Stops, ReturnType<typeof text>>);

export const stop_times = sqliteTable("stop_times", {
    trip_id: text("trip_id").notNull(),
    arrival_time: text("arrival_time"),
    departure_time: text("departure_time"),
    stop_id: text("stop_id"),
    stop_sequence: text("stop_sequence").notNull(),
} as Record<keyof StopTimes, ReturnType<typeof text>>);

export const trips = sqliteTable("trips", {
    route_id: text("route_id").notNull(),
    service_id: text("service_id").notNull(),
    trip_id: text("trip_id").notNull(),
    trip_headsign: text("trip_headsign"),
    direction_id: text("direction_id"),
    shape_id: text("shape_id"),
    wheelchair_accessible: text("wheelchair_accessible"),
    note_fr: text("note_fr"),
    note_en: text("note_en"),
} as Record<keyof Trips, ReturnType<typeof text>>);
