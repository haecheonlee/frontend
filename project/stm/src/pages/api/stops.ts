import { getRelatedStopIdsByStopId } from "@/actions/gtfs-action";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
    api: {
        responseLimit: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { stopId } = req.query;

    if (!stopId || typeof stopId !== "string") {
        res.status(400).json({ error: "Invalid stopId" });
        return;
    }

    try {
        const stopIds = await getRelatedStopIdsByStopId(stopId);
        res.status(200).json({ value: stopIds.map((p) => p.stop_id) });
    } catch {
        res.status(500).json({ error: "Error to get related stop ids." });
    }
}
