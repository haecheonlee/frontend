import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import zlib from "zlib";

interface ResponseType {
    value?: unknown;
    error?: string;
}

const decompressBrotliFile = (filePath: string) => {
    const compressedData = fs.readFileSync(filePath);
    const decompressedData = zlib.brotliDecompressSync(compressedData);
    return decompressedData.toString("utf-8");
};

const parseBrotliFile = (fileContent: string): Record<string, string>[] => {
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

export const config = {
    api: {
        responseLimit: false,
    },
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
): void {
    const { file } = req.query;

    if (!file || typeof file !== "string") {
        res.status(400).json({ error: "Missing or invalid file parameter" });
        return;
    }

    const filePath = path.join(process.cwd(), "src/data", `${file}.txt.br`);
    if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: "File not found" });
        return;
    }

    try {
        const rawData = decompressBrotliFile(filePath);
        const data = parseBrotliFile(rawData);

        res.status(200).json({ value: data });
    } catch {
        res.status(500).json({ error: "Error reading the file" });
    }
}
