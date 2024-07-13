import { API_BASE_URL } from "./config";
import { ApiEndpoints } from "./endpoint";
import { buildUrl } from "@/util/helper";

export interface ApiResponse<T> {
    data: T | null;
    status: number;
    message: string;
}

export class ApiService {
    private static baseUrl: string = API_BASE_URL;

    public static async get<T>(
        apiUrl: string,
        params?: Record<string, string>
    ): Promise<ApiResponse<T>> {
        try {
            const url = buildUrl(apiUrl, params || {});
            const response = await fetch(`${ApiService.baseUrl}${url}`);
            const data = await response.json();
            return {
                data,
                status: response.status,
                message: "Success",
            };
        } catch (error) {
            return {
                data: null,
                status: 500,
                message: error instanceof Error ? error.message : "Error",
            };
        }
    }

    public static async post<T>(
        apiUrl: string,
        body: any
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${ApiService.baseUrl}${apiUrl}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            return {
                data,
                status: response.status,
                message: "Success",
            };
        } catch (error) {
            return {
                data: null,
                status: 500,
                message: error instanceof Error ? error.message : "Error",
            };
        }
    }
}
