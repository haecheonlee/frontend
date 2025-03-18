"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Circle,
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
} from "react-leaflet";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import { useGtfs } from "@/context/gtfs-context";
import { Stops } from "@/types/gtfs";
import { dbClient } from "@/api/clients";
import { useStop } from "@/context/stop-context";
import { useVehicle } from "@/context/vehicle-context";

export default function Map() {
    return (
        <MapContainer
            className="w-full h-full rounded-sm"
            center={[45.5019, -73.5674]}
            zoom={13}
            scrollWheelZoom
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Markers />
            <VehicleMarkers />
        </MapContainer>
    );
}

function Markers() {
    const map = useMap();
    const { stops, trips } = useGtfs();
    const { value, setValue } = useStop();
    const { setRouteId } = useVehicle();

    const [isClickInProgress, setIsClickInProgress] = useState(false);
    const [visibleStops, setVisibleStops] = useState<ReadonlyArray<Stops>>([]);

    useEffect(() => {
        const updateMarkers = () => {
            const bounds = map.getBounds();

            setVisibleStops(
                stops.filter((stop) =>
                    bounds.contains([
                        Number(stop.stop_lat),
                        Number(stop.stop_lon),
                    ])
                )
            );
        };

        if (!value.stop) {
            map.on("moveend", updateMarkers);
            updateMarkers();
        }

        return () => {
            map.off("moveend", updateMarkers);
        };
    }, [map, stops, value]);

    const click = async (stopId: string) => {
        setIsClickInProgress(true);

        try {
            const stop = stops.find((p) => p.stop_id === stopId);

            if (!stop) {
                return;
            }

            const fetchedStops = await dbClient<
                Readonly<{
                    stopIds: ReadonlyArray<string>;
                    tripId: string;
                }>
            >(stop.stop_id);

            const stopIds: Record<string, boolean> =
                fetchedStops.stopIds.reduce(
                    (acc, value) => ({ ...acc, [value]: true }),
                    {}
                );
            const relatedStops = stops.filter((p) => stopIds[p.stop_id]);
            const routeId = trips.find(
                (p) => p.trip_id === fetchedStops.tripId
            )?.route_id;

            setValue({ stop });
            setVisibleStops(relatedStops);
            setRouteId(routeId);
        } finally {
            setIsClickInProgress(false);
        }
    };

    return (
        <>
            {visibleStops.map((stop) => (
                <Marker
                    key={stop.stop_id}
                    position={[Number(stop.stop_lat), Number(stop.stop_lon)]}
                    eventHandlers={
                        isClickInProgress
                            ? undefined
                            : {
                                  click: () => click(stop.stop_id),
                              }
                    }
                >
                    <Popup>{`${stop.stop_name} (${stop.stop_code})`}</Popup>
                </Marker>
            ))}
        </>
    );
}

function VehicleMarkers() {
    const { value } = useStop();
    const { vehicles, routeId } = useVehicle();

    const vehiclesByRouteId = useMemo(() => {
        if (!routeId) {
            return [];
        }

        return vehicles.filter((p) => p.trip?.routeId === routeId);
    }, [vehicles, routeId]);

    if (!value.stop || !vehicles.length) {
        return null;
    }

    return (
        <>
            {vehiclesByRouteId.map((vehicle) => (
                <Circle
                    key={vehicle.vehicle!.id}
                    center={[
                        Number(vehicle.position!.latitude),
                        Number(vehicle.position!.longitude),
                    ]}
                    radius={20}
                    pathOptions={{ color: "red" }}
                ></Circle>
            ))}
        </>
    );
}
