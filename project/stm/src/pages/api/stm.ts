import type { NextApiRequest, NextApiResponse } from "next";
import protobuf from "protobufjs";
import path from "path";
import { VehiclePosition } from "@/types/vehicle-position";

export const config = {
    api: {
        responseLimit: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { endpoint } = req.query;

    if (endpoint !== "vehiclePositions" && endpoint != "tripUpdates") {
        res.status(400).json({ error: "Invalid request." });
        return;
    }

    const { STM_API_URL, API_KEY } = process.env;

    if (!STM_API_URL) {
        res.status(400).json({ error: "Missing Url." });
        return;
    }

    if (!API_KEY) {
        res.status(400).json({ error: "Missing Api Key." });
        return;
    }

    try {
        const url = `${STM_API_URL}/${endpoint}`;

        const response = await fetch(url, {
            headers: {
                apiKey: API_KEY,
            },
            next: {
                revalidate: 60 * 5, // 5 min
            },
        });

        const arrayBuffer = await response.arrayBuffer();
        const data = await processProto(arrayBuffer);

        res.status(200).json({
            value: data.entity.map(
                (p: { vehicle: VehiclePosition }) => p.vehicle
            ),
        });
    } catch {
        res.status(500).json({ error: "Error to fetch stm data." });
    }
}

async function processProto(arrayBuffer: ArrayBuffer) {
    const protoPath = path.resolve(
        process.cwd(),
        "src/data",
        "gtfs-realtime.proto"
    );

    const root = await protobuf.load(protoPath);
    const feedMessage = root.lookupType("transit_realtime.FeedMessage");
    const decodedData = feedMessage.decode(new Uint8Array(arrayBuffer));

    return feedMessage.toObject(decodedData, {
        longs: String,
        enums: String,
        defaults: true,
    });
}
