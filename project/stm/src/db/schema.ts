import { integer, real, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const agencies = sqliteTable("agencies", {
    agency_id: text("agency_id").primaryKey().notNull(),
    agency_name: text("agency_name").notNull(),
    agency_url: text("agency_url").notNull(),
    agency_timezone: text("agency_timezone").notNull(),
    agency_lang: text("agency_lang"),
    agency_phone: text("agency_phone"),
    agency_fare_url: text("agency_fare_url"),
    agency_email: text("agency_email"),
});

export const calendar = sqliteTable("calendar", {
    service_id: text("service_id").primaryKey().notNull(),
    monday: integer("monday").notNull(),
    tuesday: integer("tuesday").notNull(),
    wednesday: integer("wednesday").notNull(),
    thursday: integer("thursday").notNull(),
    friday: integer("friday").notNull(),
    saturday: integer("saturday").notNull(),
    sunday: integer("sunday").notNull(),
    start_date: text("start_date").notNull(),
    end_date: text("end_date").notNull(),
});

export const calendar_dates = sqliteTable("calendar_dates", {
    service_id: text("service_id")
        .notNull()
        .references(() => calendar.service_id),
    date: text("date").notNull(),
    exception_type: integer("exception_type").notNull(),
});

export const feed_info = sqliteTable("feed_info", {
    feed_publisher_name: text("feed_publisher_name").notNull(),
    feed_publisher_url: text("feed_publisher_url").notNull(),
    feed_lang: text("feed_lang").notNull(),
    feed_start_date: text("feed_start_date"),
    feed_end_date: text("feed_end_date"),
});

export const routes = sqliteTable("routes", {
    route_id: text("route_id").primaryKey().notNull(),
    agency_id: text("agency_id").references(() => agencies.agency_id),
    route_short_name: text("route_short_name"),
    route_long_name: text("route_long_name"),
    route_type: integer("route_type").notNull(),
    route_url: text("route_url"),
    route_color: text("route_color"),
    route_text_color: text("route_text_color"),
});

export const shapes = sqliteTable("shapes", {
    shape_id: text("shape_id"),
    shape_pt_lat: real("shape_pt_lat").notNull(),
    shape_pt_lon: real("shape_pt_lon").notNull(),
    shape_pt_sequence: integer("shape_pt_sequence").notNull(),
});

export const stops = sqliteTable("stops", {
    stop_id: text("stop_id").primaryKey().notNull(),
    stop_code: text("stop_code").notNull(),
    stop_name: text("stop_name"),
    stop_lat: real("stop_lat"),
    stop_lon: real("stop_lon"),
    stop_url: text("stop_url"),
    location_type: integer("location_type"),
    parent_station: text("parent_station"),
    wheelchair_boarding: integer("wheelchair_boarding"),
});

export const stop_times = sqliteTable("stop_times", {
    trip_id: text("trip_id")
        .notNull()
        .references(() => trips.trip_id),
    arrival_time: text("arrival_time"),
    departure_time: text("departure_time"),
    stop_id: text("stop_id")
        .notNull()
        .references(() => stops.stop_id),
    stop_sequence: integer("stop_sequence").notNull(),
});

export const trips = sqliteTable("trips", {
    trip_id: text("trip_id").primaryKey().notNull(),
    route_id: text("route_id")
        .notNull()
        .references(() => routes.route_id),
    service_id: text("service_id")
        .notNull()
        .references(() => calendar.service_id),
    trip_headsign: text("trip_headsign"),
    direction_id: integer("direction_id"),
    shape_id: text("shape_id"),
    wheelchair_accessible: integer("wheelchair_accessible"),
    note_fr: text("note_fr"),
    note_en: text("note_en"),
});
