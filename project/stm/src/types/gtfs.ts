/**
 * GTFS Static Schedule Stop Reference:
 * https://gtfs.org/documentation/schedule/reference/#stopstxt
 */
export interface GtfsStop {
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
 * GTFS Static Routes Reference:
 * https://gtfs.org/documentation/schedule/reference/#routestxt
 */
export interface Routes {
    route_id: string;
    agency_id: string;
    route_short_name: string;
    route_long_name?: string;
    route_type: string;
    route_url?: string;
    route_color?: string;
    route_text_color?: string;
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
