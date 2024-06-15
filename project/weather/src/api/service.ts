import { ApiEndpoints } from "./endpoint";
import { buildUrl } from "@/helper/helper";

export interface ApiResponse<T> {
    data: T | null;
    status: number;
    message: string;
}

export class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async get<T>(
        endpoint: ApiEndpoints,
        params?: { [key: string]: string }
    ): Promise<ApiResponse<T>> {
        try {
            const url = params ? buildUrl(endpoint, params) : endpoint;
            const response = await fetch(`${this.baseUrl}${url}`);
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

    async post<T>(endpoint: ApiEndpoints, body: any): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
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
