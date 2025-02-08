import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

interface ResponseType {
    value?: unknown;
    error?: string;
}

/**
 * API handler to serve dynamic JSON files from the `src/data/` directory.
 * @returns Returns a JSON response with the file's contents or an error message.
 **/
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
): void {
    const { file } = req.query;

    if (!file || typeof file !== "string") {
        res.status(400).json({ error: "Missing or invalid file parameter" });
        return;
    }

    const filePath = path.join(process.cwd(), "src/data", `${file}.json`);
    if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: "File not found" });
        return;
    }

    try {
        const data = fs.readFileSync(filePath, "utf8");
        res.status(200).json({ value: JSON.parse(data) });
    } catch {
        res.status(500).json({ error: "Error reading JSON file" });
    }
}
