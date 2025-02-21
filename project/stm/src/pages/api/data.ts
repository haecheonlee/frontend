import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import zlib from "zlib";

interface ResponseType {
    value?: unknown;
    error?: string;
}

const decompressAndParseBrotliFile = (
    filePath: string
): Record<string, string>[] => {
    const compressedData = fs.readFileSync(filePath);
    const decompressedData = zlib.brotliDecompressSync(compressedData);
    const fileContent = decompressedData.toString("utf-8");

    const lines = fileContent.trim().split("\n");
    const headers = lines[0].split(",");

    return lines.slice(1).map((line) => {
        const values = line.split(",");
        const rowObject: Record<string, string> = {};
        headers.forEach((header, index) => {
            rowObject[header] = values[index];
        });
        return rowObject;
    });
};

/**
 * API handler to serve dynamic JSON files from the `data/` directory.
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

    const filePath = path.join(process.cwd(), "data", `${file}.txt.br`);
    if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: "File not found" });
        return;
    }

    try {
        const data = decompressAndParseBrotliFile(filePath);
        res.status(200).json({ value: data });
    } catch {
        res.status(500).json({ error: "Error reading the file" });
    }
}
