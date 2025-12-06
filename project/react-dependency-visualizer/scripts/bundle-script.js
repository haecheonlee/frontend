const esbuild = require("esbuild");

esbuild
    .build({
        entryPoints: ["src/generators/script.ts"],
        bundle: true,
        outfile: "dist/script.bundle.js",
        format: "iife",
        platform: "browser",
        target: "es2020",
        minify: true,
    })
    .then(() => {
        console.log("Script bundled successfully");
    })
    .catch((error) => {
        console.error("Bundle failed:", error);
        process.exit(1);
    });
