import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        STM_API_URL: process.env.STM_API_URL,
        API_KEY: process.env.API_KEY,
        DB_FILE_NAME: process.env.DB_FILE_NAME,
    },
};

export default nextConfig;
