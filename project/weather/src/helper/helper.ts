import { ApiEndpoints } from "@/api/endpoint";

export function buildUrl(
    endpoint: ApiEndpoints | string,
    params: { [key: string]: string | number }
): string {
    let url = endpoint;
    for (const key in params) {
        url = url.replace(`{${key}}`, encodeURIComponent(String(params[key])));
    }
    return url;
}
