import { GtfsFileType } from "@/types/api";
import { VehiclePosition } from "@/types/vehicle-position";

export async function stmClient(
    endpoint: "tripUpdates" | "vehiclePositions",
    options: RequestInit = {},
    timeout: number = 10_000
): Promise<ReadonlyArray<VehiclePosition>> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const url = `${window.location.origin}/api/stm?endpoint=${endpoint}`;

        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });

        clearTimeout(id);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return (await response.json())?.value ?? [];
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            throw new Error("Request timed out");
        }
        throw error;
    }
}

export async function gtfsFileClient<T>(
    fileName: GtfsFileType,
    options: RequestInit = {},
    timeout: number = 10_000
): Promise<ReadonlyArray<T>> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const { BASE_URL } = process.env;

        if (!BASE_URL) {
            throw new Error("Missing Url");
        }

        const url = `${BASE_URL}/api/data?file=${fileName}`;

        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });

        clearTimeout(id);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return (await response.json())?.value ?? [];
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            throw new Error("Request timed out");
        }
        throw error;
    }
}

export async function dbClient<T>(
    stopId: string,
    options: RequestInit = {},
    timeout: number = 10_000
): Promise<ReadonlyArray<T>> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const url = `${window.location.origin}/api/stops?stopId=${stopId}`;

        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });

        clearTimeout(id);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return (await response.json())?.value ?? [];
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            throw new Error("Request timed out");
        }
        throw error;
    }
}
