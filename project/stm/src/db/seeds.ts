import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import fs from "fs";
import zlib from "zlib";
import { parse } from "csv-parse/sync";
import * as schema from "./schema";
import path from "path";
import { SQLiteTable, TableConfig } from "drizzle-orm/sqlite-core";

async function main() {
    const db = drizzle({
        connection: {
            url: process.env.TURSO_DATABASE_URL!,
            authToken: process.env.TURSO_AUTH_TOKEN!,
        },
    });

    await seedData(db, "stop_times", schema.stop_times);
}

async function seedData(
    db: ReturnType<typeof drizzle>,
    fileName: string,
    tableType: SQLiteTable<TableConfig>
) {
    try {
        const filePath = path.join(
            process.cwd(),
            "src/data",
            `${fileName}.txt.br`
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
                `Inserting ${fileName} from ${startIndex} to ${
                    endIndex - 1
                } out of ${records.length}`
            );
            await db
                .insert(tableType)
                .values(records.slice(startIndex, endIndex))
                .run();
        }

        console.log("Seeding completed successfully: ", fileName);
    } catch (error) {
        console.error("Error seeding data:", error);
    }
}

main();
