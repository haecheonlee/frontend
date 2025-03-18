import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        BASE_URL: process.env.BASE_URL,
        STM_API_URL: process.env.STM_API_URL,
        API_KEY: process.env.API_KEY,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        DB_FILE_NAME: process.env.DB_FILE_NAME,
    },
};

export default nextConfig;
