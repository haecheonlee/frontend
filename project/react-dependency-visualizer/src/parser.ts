import fs from "fs";
import path from "path";
import { glob } from "fast-glob";
import { generateHtml } from "./html-generator";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

const allComponents = new Map<string, ComponentNode>();

export async function start(projectPath: string, options: CommandOptions) {
    if (!options.rootComponent) {
        console.error("Please provide a root component file.");
        return;
    }

    const rootPattern = `${projectPath}/**/${options.rootComponent}.{tsx,jsx}`;
    const rootFiles = await glob(rootPattern, {
        ignore: ["**/node_modules/**"],
    });

    if (rootFiles.length === 0) {
        console.error("Root component file not found:", options.rootComponent);
        return;
    }

    const rootFile = path.resolve(rootFiles[0]);

    const rootNode = await traverseComponentTree(rootFile, projectPath);
    if (!rootNode) {
        console.error("Failed to parse root component.");
        return;
    }

    const componentData = Array.from(allComponents.values());

    if (options.output) {
        console.log(`Generating HTML file at ${options.output}...`);
        const htmlContent = generateHtml(processComponentData(componentData));
        fs.writeFileSync(options.output, htmlContent);
        console.log(`HTML file is created at ${options.output}`);
    }

    componentData.forEach((data) => {
        console.log(`\nFile: ${data.file}`);
        console.log(`   Imports: ${data.imports.join(", ")}`);
        console.log(
            `   Renders: ${data.renders.map((p) => p.file).join(", ")}`
        );
    });
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

function processComponentData(componentData: ComponentNode[]): GraphData {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const nodeSet = new Set<string>();

    componentData.forEach((fileData) => {
        const { file, name, renders, imports } = fileData;
        if (!nodeSet.has(file)) {
            nodes.push({
                id: name,
                main: file.endsWith("App.jsx") || file.endsWith("App.tsx"),
                name: file,
            });
            nodeSet.add(file);
        }

        renders
            .filter((renderedComponent) =>
                imports.includes(renderedComponent.name)
            )
            .forEach((renderedComponent) => {
                const {
                    file: renderedComponentFile,
                    name: renderedComponentName,
                } = renderedComponent;

                const key = name + renderedComponentName;
                if (!nodeSet.has(key)) {
                    nodes.push({
                        id: key,
                        main: false,
                        name: renderedComponentFile,
                    });
                    nodeSet.add(key);
                }
                links.push({ source: name, target: key });
            });
    });

    return { nodes, links };
}
