/**
 * GTFS Static Schedule Agency Reference:
 * https://gtfs.org/documentation/schedule/reference/#agencytxt
 */
export interface Agency {
    agency_id?: string;
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
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
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
    exception_type: string;
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
    route_type: string;
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
    shape_pt_lat: string;
    shape_pt_lon: string;
    shape_pt_sequence: string;
}

/**
 * GTFS Static Schedule Stop Reference:
 * https://gtfs.org/documentation/schedule/reference/#stopstxt
 */
export interface Stops {
    stop_id: string;
    stop_code?: string;
    stop_name?: string;
    stop_lat?: string;
    stop_lon?: string;
    stop_url?: string;
    location_type: string;
    parent_station: string;
    wheelchair_boarding: string;
}

/**
 * GTFS Static Stop Times Reference:
 * https://gtfs.org/documentation/schedule/reference/#stop_timestxt
 */
export interface StopTimes {
    trip_id: string;
    arrival_time?: string;
    departure_time?: string;
    stop_id?: string;
    stop_sequence: string;
}

/**
 * GTFS Static Trips Reference:
 * https://gtfs.org/documentation/schedule/reference/#tripstxt
 */
export interface Trips {
    route_id: string;
    service_id: string;
    trip_id: string;
    trip_headsign?: string;
    direction_id?: string;
    shape_id?: string;
    wheelchair_accessible?: string;
    note_fr?: string;
    note_en?: string;
}
