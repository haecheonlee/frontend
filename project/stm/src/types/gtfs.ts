/**
 * GTFS Static Schedule Agency Reference:
 * https://gtfs.org/documentation/schedule/reference/#agencytxt
 */
export interface Agency {
    agency_id: string;
    agency_name: string;
    agency_url: string;
    agency_timezone: string;
    agency_lang?: string;
    agency_phone?: string;
    agency_fare_url?: string;
    agency_email?: string;
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
    feed_start_date?: string;
    feed_end_date?: string;
}

/**
 * GTFS Static Routes Reference:
 * https://gtfs.org/documentation/schedule/reference/#routestxt
 */
export interface Routes {
    route_id: string;
    agency_id?: string;
    route_short_name?: string;
    route_long_name?: string;
    route_type: number;
    route_url?: string;
    route_color?: string;
    route_text_color?: string;
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
    stop_code?: string;
    stop_name?: string;
    stop_lat?: number;
    stop_lon?: number;
    stop_url?: string;
    location_type?: number;
    parent_station?: string;
    wheelchair_boarding?: number;
}

/**
 * GTFS Static Stop Times Reference:
 * https://gtfs.org/documentation/schedule/reference/#stop_timestxt
 */
export interface StopTimes {
    trip_id: string;
    stop_id: string;
    arrival_time?: string;
    departure_time?: string;
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
    trip_headsign?: string;
    direction_id?: number;
    shape_id?: string;
    wheelchair_accessible?: number;
    note_fr?: string;
    note_en?: string;
}
