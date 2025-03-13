"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import { useGtfs } from "@/context/gtfs-context";
import { Stops } from "@/types/gtfs";
import { dbClient } from "@/api/clients";
import { useStop } from "@/context/stop-context";

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
        </MapContainer>
    );
}

function Markers() {
    const map = useMap();
    const { stops } = useGtfs();
    const { value, setValue } = useStop();

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

            const relatedStopIds = await dbClient<string>(stop.stop_id);
            const relatedStops = stops.filter((p) =>
                relatedStopIds.includes(p.stop_id)
            );

            setValue({ stop });
            setVisibleStops(relatedStops);
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
