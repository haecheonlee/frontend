export interface ApiResponse<T> {
    data?: T;
    success: boolean;
    message?: string;
}

export type GtfsJsonFileType = "stops";
