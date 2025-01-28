import { ApiResponse } from "@/types/api";
import { stmClient } from "./client";
import { STM_ENDPOINTS } from "./endpoints";

type StmClientRequestParameters = {
    endpoint: keyof typeof STM_ENDPOINTS;
    options?: RequestInit;
    timeout?: number;
};

export const fetchStmClientRequest = async <T>({
    endpoint,
    options,
    timeout,
}: StmClientRequestParameters): Promise<ApiResponse<T>> => {
    try {
        const response = await stmClient(
            STM_ENDPOINTS[endpoint],
            options,
            timeout
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        return {
            data: data as T,
            success: true,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred",
        };
    }
};
