import { getStopsByStopId } from "@/actions/gtfs-action";
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
        const response = await getStopsByStopId(stopId);
        res.status(200).json({ value: response });
    } catch {
        res.status(500).json({ error: "Error to get related stops." });
    }
}
