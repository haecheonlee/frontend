import fs from "fs";
import path from "path";

export interface TsConfigContext {
    baseUrl: string;
    pathMappings: Record<string, string[]>;
    projectRoot: string;
}

export function findProjectRoot(startDir: string): string {
    let currentDir = startDir;
    const root = path.parse(currentDir).root;

    while (currentDir !== root) {
        const tsconfigPath = path.join(currentDir, "tsconfig.json");
        const packageJsonPath = path.join(currentDir, "package.json");

        if (fs.existsSync(tsconfigPath) || fs.existsSync(packageJsonPath)) {
            console.log(`Found project root at: ${currentDir}`);
            return currentDir;
        }

        const parentDir = path.dirname(currentDir);

        if (parentDir === currentDir) {
            break;
        }

        currentDir = parentDir;
    }

    console.log(`No project root found, using: ${startDir}`);
    return startDir;
}

export function loadTsConfigPaths(projectPath: string): TsConfigContext {
    const projectRoot = findProjectRoot(projectPath);
    const tsconfigPath = path.join(projectRoot, "tsconfig.json");

    const context: TsConfigContext = {
        baseUrl: "",
        pathMappings: {},
        projectRoot,
    };

    if (!fs.existsSync(tsconfigPath)) {
        console.log(
            "No tsconfig.json found at project root, skipping path mapping"
        );
        return context;
    }

    try {
        const tsconfigContent = fs.readFileSync(tsconfigPath, "utf-8");
        const tsconfig = JSON.parse(tsconfigContent);

        if (tsconfig.compilerOptions) {
            const rawBaseUrl = tsconfig.compilerOptions.baseUrl || ".";
            context.baseUrl = path.resolve(projectRoot, rawBaseUrl);
            context.pathMappings = tsconfig.compilerOptions.paths || {};

            console.log(`Loaded tsconfig from: ${tsconfigPath}`);
            console.log(`Base URL resolved to: ${context.baseUrl}`);
            console.log("Path mappings:", Object.keys(context.pathMappings));
        }
    } catch (error) {
        console.warn("Failed to parse tsconfig.json:", error);
    }

    return context;
}

export function resolveRelativePath(
    importPath: string,
    currentDir: string
): string | null {
    const fullPath = path.resolve(currentDir, importPath);
    const extensions = [".tsx", ".jsx", ".ts", ".js"];

    for (const ext of extensions) {
        const candidate = `${fullPath}${ext}`;
        if (fs.existsSync(candidate)) return candidate;
    }

    for (const ext of extensions) {
        const candidate = path.join(fullPath, `index${ext}`);
        if (fs.existsSync(candidate)) return candidate;
    }

    return null;
}

export function resolveTsConfigPath(
    importPath: string,
    context: TsConfigContext
): string | null {
    const { baseUrl, pathMappings } = context;

    for (const [pattern, replacements] of Object.entries(pathMappings)) {
        const patternRegex = new RegExp(
            "^" + pattern.replace(/\*/g, "(.*)") + "$"
        );
        const match = importPath.match(patternRegex);

        if (match) {
            for (const replacement of replacements) {
                let resolvedPath = replacement;

                if (match[1]) {
                    resolvedPath = resolvedPath.replace(/\*/g, match[1]);
                }

                const fullPath = path.resolve(baseUrl, resolvedPath);

                const resolved = resolveRelativePath(
                    fullPath,
                    path.dirname(fullPath)
                );
                if (resolved) return resolved;

                const extensions = [".tsx", ".jsx", ".ts", ".js"];
                for (const ext of extensions) {
                    const candidate = `${fullPath}${ext}`;
                    if (fs.existsSync(candidate)) return candidate;
                }
            }
        }
    }

    if (baseUrl) {
        const fullPath = path.resolve(baseUrl, importPath);
        return resolveRelativePath(fullPath, path.dirname(fullPath));
    }

    return null;
}

export function resolveImportPath(
    importPath: string,
    currentDir: string,
    context: TsConfigContext
): string | null {
    if (!importPath) {
        return null;
    }

    if (importPath.startsWith(".")) {
        return resolveRelativePath(importPath, currentDir);
    }

    if (context.baseUrl && Object.keys(context.pathMappings).length > 0) {
        const resolved = resolveTsConfigPath(importPath, context);
        if (resolved) return resolved;
    }

    return null;
}
