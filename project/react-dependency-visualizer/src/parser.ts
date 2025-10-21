import fs from "fs";
import path from "path";
import { glob } from "fast-glob";
import { generateHtml } from "./html-generator";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

const allComponents = new Map<string, ComponentNode>();
let pathMappings: Record<string, string[]> = {};
let baseUrl: string = "";

export async function start(
    rootComponentPath: string,
    options: CommandOptions
) {
    const resolvedPath = path.resolve(rootComponentPath);

    if (!fs.existsSync(resolvedPath)) {
        console.error("Root component file not found:", rootComponentPath);
        return;
    }

    const projectPath = path.dirname(resolvedPath);
    const rootFile = resolvedPath;

    loadTsConfigPaths(projectPath);

    const rootNode = await traverseComponentTree(rootFile, projectPath);
    if (!rootNode) {
        console.error("Failed to parse root component.");
        return;
    }

    const componentData = Array.from(allComponents.values());
    const rootRelativePath = `./${path.relative(projectPath, rootFile)}`;

    if (options.output) {
        console.log(`Generating HTML file at ${options.output}...`);
        const htmlContent = generateHtml(
            processComponentData(componentData, rootRelativePath)
        );
        fs.writeFileSync(options.output, htmlContent);
        console.log(`HTML file is created at ${options.output}`);
    }

    componentData.forEach((data) => {
        console.log(`\nFile: ${data.file}`);
        console.log(`   Imports: ${data.imports.join(", ")}`);
        console.log(
            `   Renders: ${data.renders.map((p) => p.name).join(", ")}`
        );
    });
}

function findProjectRoot(startDir: string): string {
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

function loadTsConfigPaths(projectPath: string) {
    const basePath = findProjectRoot(projectPath);
    const tsconfigPath = path.join(basePath, "tsconfig.json");

    if (!fs.existsSync(tsconfigPath)) {
        console.log(
            "No tsconfig.json found at project root, skipping path mapping"
        );
        return;
    }

    try {
        const tsconfigContent = fs.readFileSync(tsconfigPath, "utf-8");
        const tsconfig = JSON.parse(tsconfigContent);

        if (tsconfig.compilerOptions) {
            baseUrl = tsconfig.compilerOptions.baseUrl || ".";
            pathMappings = tsconfig.compilerOptions.paths || {};

            console.log(`Loaded tsconfig from: ${tsconfigPath}`);
            console.log("Path mappings:", Object.keys(pathMappings));
        }
    } catch (error) {
        console.warn("Failed to parse tsconfig.json:", error);
    }
}

async function traverseComponentTree(
    filePath: string,
    projectPath: string
): Promise<ComponentNode | null> {
    const absolutePath = path.resolve(filePath);

    if (allComponents.has(absolutePath) || !fs.existsSync(absolutePath)) {
        return allComponents.get(absolutePath) ?? null;
    }

    const node = parseComponentFile(absolutePath, projectPath);
    allComponents.set(absolutePath, node);

    for (const render of node.renders) {
        const renderPath = resolveImportPath(
            render.file,
            path.dirname(filePath)
        );

        if (renderPath) {
            const resolvedPath = path.resolve(renderPath);
            const relativePath = `./${path.relative(
                projectPath,
                resolvedPath
            )}`;

            render.file = relativePath;

            await traverseComponentTree(resolvedPath, projectPath);
        }
    }

    return node;
}

function resolveImportPath(
    importPath: string,
    currentDir: string
): string | null {
    if (!importPath) {
        return null;
    }

    if (!importPath.startsWith(".")) {
        return null;
    }
    const fullPath = path.resolve(currentDir, importPath);
    const extensions = [".tsx", ".jsx"];

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

function parseComponentFile(
    filePath: string,
    projectPath: string
): ComponentNode {
    const code = fs.readFileSync(filePath, "utf-8");
    const imports: string[] = [];
    const renders: Component[] = [];

    const importMap: Record<string, string> = {};

    const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
    });

    const baseFileName = path.basename(filePath, path.extname(filePath));

    traverse(ast, {
        ImportDeclaration(path) {
            const importPath = path.node.source.value;

            path.node.specifiers.forEach((specifier) => {
                if (
                    specifier.type === "ImportDefaultSpecifier" ||
                    specifier.type === "ImportSpecifier"
                ) {
                    const name = specifier.local.name;
                    importMap[name] = importPath;
                    imports.push(name);
                }
            });
        },

        JSXOpeningElement(path) {
            const jsx = path.node.name;
            if (jsx && jsx.type === "JSXIdentifier") {
                const componentName = jsx.name;

                if (componentName[0] === componentName[0].toUpperCase()) {
                    const resolved = importMap[componentName];

                    renders.push({
                        file: resolved,
                        name: componentName,
                    });
                }
            }
        },
    });

    const relativeFilePath = `./${path.relative(projectPath, filePath)}`;

    return {
        file: relativeFilePath,
        name: baseFileName,
        imports: [...new Set(imports)],
        renders: [...new Set(renders)],
    };
}

function processComponentData(
    componentData: ComponentNode[],
    startFile: string
): GraphData {
    const fileMap = new Map(componentData.map((comp) => [comp.file, comp]));
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const createdNodeIds = new Set<string>();

    function getNodeId(file: string, parentId: string | null): string {
        return parentId ? `${file}@${parentId}` : file;
    }

    function traverse(file: string, parentId: string | null): string | null {
        const component = fileMap.get(file);

        if (!component) {
            return null;
        }

        const nodeId = getNodeId(file, parentId ?? "root");

        if (!createdNodeIds.has(nodeId)) {
            nodes.push({
                id: nodeId,
                main: parentId === null,
                name: component.name,
            });

            createdNodeIds.add(nodeId);
        }

        if (parentId) {
            links.push({
                source: parentId,
                target: nodeId,
            });
        }

        for (const rendered of component.renders) {
            if (component.imports.includes(rendered.name)) {
                traverse(rendered.file, nodeId);
            }
        }

        return nodeId;
    }

    traverse(startFile, null);

    return { nodes, links };
}
