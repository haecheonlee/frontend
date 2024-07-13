export const ApiEndpoints: Record<string, { url: string }> = {
    GET_WEATHER: {
        url: "/weather?q={city}&appid={apiKey}&units=metric",
    },
    GET_FORECAST: {
        url: "/forecast?q={city}&appid={apiKey}&cnt={count}&units=metric",
    },
} as const;
