/**
 * GTFS v2 Realtime Vehicle Position Reference:
 * https://gtfs.org/documentation/realtime/reference/#message-vehicleposition
 */
export interface VehiclePosition {
    trip?: TripDescriptor;
    vehicle?: VehicleDescriptor;
    position?: Position;
    currentStopSequence?: number;
    stopId?: string;
    currentStatus?: VehicleStopStatus;
    timestamp?: number;
    congestionLevel?: CongestionLevel;
    occupancyStatus?: OccupancyStatus;
    occupancyPercentage?: number;
    multiCarriageDetails?: CarriageDetails;
}

export interface TripDescriptor {
    tripId?: string;
    routeId?: string;
    directionId?: number;
    startTime?: string;
    startDate?: string;
    scheduleRelationship?: ScheduleRelationship;
    modifiedTrip?: ModifiedTripSelector;
}

export interface VehicleDescriptor {
    id?: string;
    label?: string;
    licensePlate?: string;
    wheelchairAccessible?: WheelchairAccessible;
}

export interface Position {
    latitude: number;
    longitude: number;
    bearing?: number;
    odometer?: number;
    speed?: number;
}

export interface CarriageDetails {
    id?: string;
    label?: string;
    occupancyStatus?: OccupancyStatus;
    occupancyPercentage?: number;
    carriageSequence: number;
}

export interface ModifiedTripSelector {
    modificationsId: string;
    affectedTripId: string;
    startTime?: string;
    startDate?: string;
}

export enum VehicleStopStatus {
    INCOMING_AT,
    STOPPED_AT,
    IN_TRANSIT_TO,
}

export enum CongestionLevel {
    UNKNOWN_CONGESTION_LEVEL,
    RUNNING_SMOOTHLY,
    STOP_AND_GO,
    CONGESTION,
    SEVERE_CONGESTION,
}

export enum OccupancyStatus {
    EMPTY,
    MANY_SEATS_AVAILABLE,
    FEW_SEATS_AVAILABLE,
    STANDING_ROOM_ONLY,
    CRUSHED_STANDING_ROOM_ONLY,
    FULL,
    NOT_ACCEPTING_PASSENGERS,
    NO_DATA_AVAILABLE,
    NOT_BOARDABLE,
}

export enum ScheduleRelationship {
    SCHEDULED,
    ADDED,
    UNSCHEDULED,
    CANCELED,
    DUPLICATED,
    DELETED,
}

export enum WheelchairAccessible {
    NO_VALUE,
    UNKNOWN,
    WHEELCHAIR_ACCESSIBLE,
    WHEELCHAIR_INACCESSIBLE,
}
