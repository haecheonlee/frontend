import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    build: {
        outDir: path.resolve(__dirname, "dist"),
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    server: {
        open: true,
    },
});
