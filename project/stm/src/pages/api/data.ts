import type { NextApiRequest, NextApiResponse } from "next";
import { GtfsType } from "@/types/api";
import { getData } from "@/actions/gtfs-action";

export const config = {
    api: {
        responseLimit: false,
    },
};

export default async function handler(
    _: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    const types: ReadonlyArray<GtfsType> = [
        "agency",
        "calendar",
        "calendarDates",
        "feedInfo",
        "routes",
        "shapes",
        "stops",
        "trips",
    ];
    const promises = types.map((p) => getData(p));
    const result = await Promise.all(promises);

    const resultMapper = result.reduce(
        (acc, value, index) => ({
            ...acc,
            [types[index]]: value,
        }),
        {}
    );

    try {
        res.status(200).json({ value: resultMapper });
    } catch {
        res.status(500).json({ error: "Error while fetching data" });
    }
}
