import { ApiResponse } from "@/types/api";
import { stmClient } from "./client";
import { STM_ENDPOINTS } from "./endpoints";
import path from "path";
import protobuf from "protobufjs";

type StmClientRequestParameters = {
    endpoint: keyof typeof STM_ENDPOINTS;
    options?: RequestInit;
    timeout?: number;
};

const processProto = async (arrayBuffer: ArrayBuffer, fileName: string) => {
    const protoPath = path.join(process.cwd(), "src/data", fileName);
    const root = await protobuf.load(protoPath);

    const protobufType = root.lookupType("transit_realtime.FeedMessage");
    const feedMessage = protobufType.decode(new Uint8Array(arrayBuffer));

    return protobufType.toObject(feedMessage, {
        enums: String,
        longs: String,
        bytes: String,
        defaults: true,
    });
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

        const decodedProtobufObject = await processProto(
            await response.arrayBuffer(),
            "gtfs-realtime.proto"
        );

        return {
            data: decodedProtobufObject as T,
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
