import fs from "fs";
import path from "path";
import { TsConfigContext, resolveImportPath } from "./resolver";
import { parseComponentFile } from "./deprecated-parser";

function isBarrelFile(filePath: string): boolean {
    const fileName = path.basename(filePath);

    return (
        fileName === "index.ts" ||
        fileName === "index.tsx" ||
        fileName === "index.js" ||
        fileName === "index.jsx"
    );
}

function parseBarrelExports(filePath: string, exportName: string): string[] {
    const content = fs.readFileSync(filePath, "utf-8");
    const exports: string[] = [];

    const namedExportRegex = new RegExp(
        `export\\s*{[^}]*\\b${exportName}\\b[^}]*}\\s*from\\s*['"]([^'"]+)['"]`,
        "g"
    );

    const starExportRegex = /export\s*\*\s*from\s*['"]([^'"]+)['"]/g;
    const defaultAsExportRegex = new RegExp(
        `export\\s*{\\s*default\\s+as\\s+${exportName}\\s*}\\s*from\\s*['"]([^'"]+)['"]`,
        "g"
    );

    let match;
    while ((match = namedExportRegex.exec(content)) !== null) {
        exports.push(match[1]);
    }

    const defaultAsContent = content;
    while ((match = defaultAsExportRegex.exec(defaultAsContent)) !== null) {
        exports.push(match[1]);
    }

    while ((match = starExportRegex.exec(content)) !== null) {
        exports.push(match[1]);
    }

    return exports;
}

async function resolveActualComponentPath(
    importedName: string,
    resolvedPath: string,
    context: TsConfigContext,
    visited: Set<string> = new Set()
): Promise<string | null> {
    if (visited.has(resolvedPath)) {
        return null;
    }
    visited.add(resolvedPath);

    if (!isBarrelFile(resolvedPath)) {
        return resolvedPath;
    }

    const reExportPaths = parseBarrelExports(resolvedPath, importedName);

    for (const reExportPath of reExportPaths) {
        const actualPath = resolveImportPath(
            reExportPath,
            path.dirname(resolvedPath),
            context
        );

        if (actualPath && fs.existsSync(actualPath)) {
            const finalPath = await resolveActualComponentPath(
                importedName,
                actualPath,
                context,
                visited
            );

            if (finalPath) {
                return finalPath;
            }
        }
    }

    return null;
}

export async function traverseComponentTree(
    filePath: string,
    projectPath: string,
    context: TsConfigContext,
    allComponents: Map<string, ComponentNode>
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
            path.dirname(filePath),
            context
        );

        if (renderPath) {
            const actualPath = await resolveActualComponentPath(
                render.name,
                renderPath,
                context
            );

            const resolvedPath = path.resolve(actualPath || renderPath);
            const relativePath = `./${path.relative(
                projectPath,
                resolvedPath
            )}`;

            render.file = relativePath;

            await traverseComponentTree(
                resolvedPath,
                projectPath,
                context,
                allComponents
            );
        }
    }

    for (const hook of node.hooks) {
        const hookPath = resolveImportPath(
            hook.file,
            path.dirname(filePath),
            context
        );

        if (hookPath) {
            const actualPath = await resolveActualComponentPath(
                hook.name,
                hookPath,
                context
            );

            const resolvedPath = path.resolve(actualPath || hookPath);
            const relativePath = `./${path.relative(
                projectPath,
                resolvedPath
            )}`;
            hook.file = relativePath;

            await traverseComponentTree(
                resolvedPath,
                projectPath,
                context,
                allComponents
            );
        }
    }

    return node;
}

export function processComponentData(
    componentData: ComponentNode[],
    startFile: string
): DeprecatedGraphData {
    const fileMap = new Map(componentData.map((comp) => [comp.file, comp]));
    const nodeIds = new Set<string>();
    const nodes: DeprecatedGraphNode[] = [];
    const links: GraphLink[] = [];

    traverse(fileMap, nodeIds, nodes, links, startFile, null);

    return { nodes, links };
}

function getNodeId(file: string, parentId: string | null): string {
    return parentId ? `${file}@${parentId}` : file;
}

function traverse(
    fileMap: ReadonlyMap<string, ComponentNode>,
    nodeIds: Set<string>,
    nodes: DeprecatedGraphNode[],
    links: GraphLink[],
    file: string,
    parentId: string | null
): string | null {
    const component = fileMap.get(file);

    if (!component) {
        return null;
    }

    const nodeId = getNodeId(file, parentId ?? "root");

    if (!nodeIds.has(nodeId)) {
        nodes.push({
            id: nodeId,
            name: component.name,
        });

        nodeIds.add(nodeId);
    }

    if (parentId) {
        links.push({
            source: parentId,
            target: nodeId,
        });
    }

    for (const rendered of component.renders) {
        if (component.imports.includes(rendered.name)) {
            traverse(fileMap, nodeIds, nodes, links, rendered.file, nodeId);
        }
    }

    for (const hook of component.hooks) {
        if (component.imports.includes(hook.name)) {
            traverse(fileMap, nodeIds, nodes, links, hook.file, nodeId);
        }
    }

    return nodeId;
}
