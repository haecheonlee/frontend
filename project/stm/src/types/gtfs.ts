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
