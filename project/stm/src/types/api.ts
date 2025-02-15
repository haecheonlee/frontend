export interface ApiResponse<T> {
    data?: T;
    success: boolean;
    message?: string;
}

export type GtfsJsonFileType =
    | "agency"
    | "calendar_dates"
    | "calendar"
    | "feed_info"
    | "routes"
    | "shapes"
    | "stop_times"
    | "stops"
    | "trips";
