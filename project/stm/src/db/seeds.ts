import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "fs";
import zlib from "zlib";
import { GtfsType } from "@/types/api";
import { parse } from "csv-parse/sync";
import * as schema from "./schema";
import path from "path";
import { SQLiteTable, TableConfig } from "drizzle-orm/sqlite-core";
import { db } from "./drizzle";

const seeds: Array<
    Readonly<{ fileName: GtfsType; tableType: SQLiteTable<TableConfig> }>
> = [
    {
        fileName: "agency",
        tableType: schema.agencies,
    },
    {
        fileName: "calendar",
        tableType: schema.calendar,
    },
    {
        fileName: "calendarDates",
        tableType: schema.calendar_dates,
    },
    {
        fileName: "feedInfo",
        tableType: schema.feed_info,
    },
    {
        fileName: "routes",
        tableType: schema.routes,
    },
    {
        fileName: "shapes",
        tableType: schema.shapes,
    },
    {
        fileName: "stops",
        tableType: schema.stops,
    },
    {
        fileName: "trips",
        tableType: schema.trips,
    },
    {
        fileName: "stopTimes",
        tableType: schema.stop_times,
    },
] as const;

async function main() {
    for (const seed of seeds) {
        await seedData(db, seed);
    }
}

async function seedData(
    db: ReturnType<typeof drizzle>,
    seed: (typeof seeds)[0]
) {
    try {
        const filePath = path.join(
            process.cwd(),
            "src/data",
            `${seed.fileName}.txt.br`
        );

        if (!fs.existsSync(filePath)) {
            console.log("file does not exist", filePath);
            return;
        }

        const compressedData = fs.readFileSync(filePath);
        const data = zlib.brotliDecompressSync(compressedData).toString();

        const records: Array<unknown> = parse(data, {
            columns: true,
            skip_empty_lines: true,
        });

        const offset = 3000;
        for (let i = 0; i < records.length; i++) {
            const startIndex = i * offset;
            const endIndex = Math.min(records.length, (i + 1) * offset);

            if (startIndex >= records.length) break;
            console.log(
                `Inserting ${seed.fileName} from ${startIndex} to ${
                    endIndex - 1
                } out of ${records.length}`
            );
            await db
                .insert(seed.tableType)
                .values(records.slice(startIndex, endIndex))
                .run();
        }

        console.log("Seeding completed successfully: ", seed.fileName);
    } catch (error) {
        console.error("Error seeding data:", error);
    }
}

main();
