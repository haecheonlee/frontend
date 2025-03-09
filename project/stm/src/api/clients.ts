import { GtfsFileType } from "@/types/api";

export async function stmClient(
    endpoint: string,
    options: RequestInit = {},
    timeout: number = 10_000
): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const { STM_API_URL, API_KEY } = process.env;

        if (!STM_API_URL) {
            throw new Error("Missing Url");
        }

        if (!API_KEY) {
            throw new Error("Missing STM Api Key");
        }

        const url = `${STM_API_URL}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                apiKey: API_KEY,
            },
            signal: controller.signal,
        });

        clearTimeout(id);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response;
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
