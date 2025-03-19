export interface ApiResponse<T> {
    data?: T;
    success: boolean;
    message?: string;
}

export type GtfsType =
    | "agency"
    | "calendar"
    | "calendarDates"
    | "feedInfo"
    | "routes"
    | "shapes"
    | "stopTimes"
    | "stops"
    | "trips";
