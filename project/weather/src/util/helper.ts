import { ApiEndpoints } from "@/api/endpoint";

export function buildUrl(
    endpoint: ApiEndpoints | string,
    params: { [key: string]: string }
): string {
    let url = endpoint;
    for (const key in params) {
        url = url.replace(`{${key}}`, encodeURIComponent(params[key]));
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
