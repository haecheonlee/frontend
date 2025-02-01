export async function stmClient(
    endpoint: string,
    options: RequestInit = {},
    timeout: number = 10_000
): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const { BASE_URL, API_KEY } = process.env;

        if (!BASE_URL) {
            throw new Error("Missing Url");
        }

        if (!API_KEY) {
            throw new Error("Missing STM Api Key");
        }

        const url = `${BASE_URL}${endpoint}`;

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
