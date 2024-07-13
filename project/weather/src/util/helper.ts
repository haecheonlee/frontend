export function buildUrl(url: string, params: Record<string, string>): string {
    for (const [key, value] of Object.entries(params)) {
        url = url.replace(`{${key}}`, encodeURIComponent(value));
    }
    return url;
}

export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    wait: number
) {
    let timeout: NodeJS.Timeout | undefined;

    return function (...args: Parameters<T>): void {
        const run = () => {
            clearTimeout(timeout);
            fn(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(run, wait);
    };
}
