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
import { defaultIcon, redIcon } from "@/lib/utils";

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

    useEffect(() => {
        if (!value.stop) {
            return;
        }

        let active = true;

        async function fetchRelatedStops() {
            const { stops, routeId } = await dbClient<
                Readonly<{
                    stops: ReadonlyArray<Stops>;
                    routeId: string;
                }>
            >("stops", { stopId: value.stop!.stop_id });

            if (!active) {
                return;
            }

            setVisibleStops(stops);
            setRouteId(routeId);
        }

        fetchRelatedStops();

        return () => {
            active = true;
        };
    }, [setRouteId, stops, trips, value.stop]);

    const click = async (stopId: string) => {
        setIsClickInProgress(true);

        try {
            const stop = stops.find((p) => p.stop_id === stopId);

            if (!stop) {
                return;
            }

            setValue({ stop });
            setVisibleStops([]);
            setRouteId(undefined);
        } finally {
            setIsClickInProgress(false);
        }
    };

    return (
        <>
            {value.stop && (
                <Marker
                    key={value.stop.stop_id}
                    position={[
                        Number(value.stop.stop_lat),
                        Number(value.stop.stop_lon),
                    ]}
                    icon={redIcon}
                >
                    <Popup>{`${value.stop.stop_name} (${value.stop.stop_code})`}</Popup>
                </Marker>
            )}
            {visibleStops.map((stop) => (
                <Marker
                    key={stop.stop_id}
                    position={[Number(stop.stop_lat), Number(stop.stop_lon)]}
                    icon={defaultIcon}
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
