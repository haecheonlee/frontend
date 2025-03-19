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

export async function dbClient<T>(
    endpoint: string,
    params: Record<string, string | number | boolean> = {},
    options: RequestInit = {},
    timeout: number = 10_000
): Promise<T> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const queryString = new URLSearchParams(
            Object.entries(params).map(([key, value]) => [key, String(value)])
        ).toString();

        const url = `${window.location.origin}/api/${endpoint}${
            queryString ? `?${queryString}` : ""
        }`;

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
