/**
 * GTFS Static Schedule Agency Reference:
 * https://gtfs.org/documentation/schedule/reference/#agencytxt
 */
export interface Agency {
    agency_id: string;
    agency_name: string;
    agency_url: string;
    agency_timezone: string;
    agency_lang: string | null;
    agency_phone: string | null;
    agency_fare_url: string | null;
    agency_email: string | null;
}

/**
 * GTFS Static Calendar Reference:
 * https://gtfs.org/documentation/schedule/reference/#calendartxt
 */
export interface Calendar {
    service_id: string;
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
    start_date: string;
    end_date: string;
}

/**
 * GTFS Static Calendar Dates Reference:
 * https://gtfs.org/documentation/schedule/reference/#calendar_datestxt
 */
export interface CalendarDates {
    service_id: string;
    date: string;
    exception_type: number;
}

/**
 * GTFS Static Feed Info Reference:
 * https://gtfs.org/documentation/schedule/reference/#feed_infotxt
 */
export interface FeedInfo {
    feed_publisher_name: string;
    feed_publisher_url: string;
    feed_lang: string;
    feed_start_date: string | null;
    feed_end_date: string | null;
}

/**
 * GTFS Static Routes Reference:
 * https://gtfs.org/documentation/schedule/reference/#routestxt
 */
export interface Routes {
    route_id: string;
    agency_id: string | null;
    route_short_name: string | null;
    route_long_name: string | null;
    route_type: number;
    route_url: string | null;
    route_color: string | null;
    route_text_color: string | null;
}

/**
 * GTFS Static Shapes Reference:
 * https://gtfs.org/documentation/schedule/reference/#shapestxt
 */
export interface Shapes {
    shape_id: string;
    shape_pt_lat: number;
    shape_pt_lon: number;
    shape_pt_sequence: number;
}

/**
 * GTFS Static Schedule Stop Reference:
 * https://gtfs.org/documentation/schedule/reference/#stopstxt
 */
export interface Stops {
    stop_id: string;
    stop_code: string;
    stop_name: string | null;
    stop_lat: number | null;
    stop_lon: number | null;
    stop_url: string | null;
    location_type: number | null;
    parent_station: string | null;
    wheelchair_boarding: number | null;
}

/**
 * GTFS Static Stop Times Reference:
 * https://gtfs.org/documentation/schedule/reference/#stop_timestxt
 */
export interface StopTimes {
    trip_id: string;
    stop_id: string;
    arrival_time: string | null;
    departure_time: string | null;
    stop_sequence: number;
}

/**
 * GTFS Static Trips Reference:
 * https://gtfs.org/documentation/schedule/reference/#tripstxt
 */
export interface Trips {
    trip_id: string;
    route_id: string;
    service_id: string;
    trip_headsign: string | null;
    direction_id: number;
    shape_id: string | null;
    wheelchair_accessible: number | null;
    note_fr: string | null;
    note_en: string | null;
}

// Defines custom types for GTFS
export type RoutesWithDirectionId = Routes & {
    direction_id: Trips["direction_id"];
};

export type RoutesDirectionType = Readonly<{
    route_id: Routes["route_id"];
    direction_id: Trips["direction_id"];
}>;
