import fs from "fs";
import path from "path";
import { parseComponentFile } from "./parser";
import { resolveImportPath } from "./resolver";

function excludePath(
    absolutePath: string,
    projectPath: string,
    excludeFolders: string[]
): boolean {
    if (excludeFolders.length === 0) {
        return false;
    }

    const relativePath = path.relative(projectPath, absolutePath);

    return excludeFolders.some((excludePattern) => {
        const normalizedPattern = excludePattern.replace(/^\/+|\/+$/g, "");

        if (
            normalizedPattern.includes("/") ||
            normalizedPattern.includes(path.sep)
        ) {
            return (
                relativePath.includes(normalizedPattern) ||
                relativePath.includes(
                    normalizedPattern.replace(/\//g, path.sep)
                )
            );
        }

        const pathParts = relativePath.split(path.sep);
        return pathParts.includes(normalizedPattern);
    });
}

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
    allFiles: Map<string, FileNode>,
    excludeFolders: string[] = []
): Promise<FileNode | null> {
    const absolutePath = path.resolve(filePath);

    if (allFiles.has(absolutePath) || !fs.existsSync(absolutePath)) {
        return allFiles.get(absolutePath) ?? null;
    }

    if (excludePath(absolutePath, projectPath, excludeFolders)) {
        return null;
    }

    const node = parseComponentFile(absolutePath, projectPath);
    allFiles.set(absolutePath, node);

    for (const exportNode of node.exports) {
        for (const dep of exportNode.dependencies) {
            const depPath = resolveImportPath(
                dep.file,
                path.dirname(filePath),
                context
            );

            if (depPath) {
                const actualPath = await resolveActualComponentPath(
                    dep.name,
                    depPath,
                    context
                );

                const resolvedPath = path.resolve(actualPath || depPath);

                if (excludePath(resolvedPath, projectPath, excludeFolders)) {
                    continue;
                }

                const relativePath = `./${path.relative(
                    projectPath,
                    resolvedPath
                )}`;

                dep.file = relativePath;

                await traverseComponentTree(
                    resolvedPath,
                    projectPath,
                    context,
                    allFiles,
                    excludeFolders
                );
            }
        }
    }

    return node;
}

export function processComponentData(
    fileNodes: FileNode[],
    startFile: string,
    startExport?: string
): GraphData {
    const fileMap = new Map(fileNodes.map((node) => [node.file, node]));
    const nodeIds = new Set<string>();
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    const startNode = fileMap.get(startFile);
    if (!startNode) {
        return { nodes, links };
    }

    const rootExport = startExport
        ? startNode.exports.find((e) => e.name === startExport)
        : startNode.exports[0];

    if (!rootExport) {
        return { nodes, links };
    }

    const rootId = `${startFile}:${rootExport.name}`;
    nodes.push({
        id: rootId,
        name: rootExport.name,
        type: "component",
    });
    nodeIds.add(rootId);

    traverseExport(
        fileMap,
        nodeIds,
        nodes,
        links,
        startFile,
        rootExport.name,
        rootId
    );

    return { nodes, links };
}

function traverseExport(
    fileMap: ReadonlyMap<string, FileNode>,
    nodeIds: Set<string>,
    nodes: GraphNode[],
    links: GraphLink[],
    file: string,
    exportName: string,
    parentId: string
): void {
    const fileNode = fileMap.get(file);
    if (!fileNode) {
        return;
    }

    const exportNode = fileNode.exports.find((e) => e.name === exportName);
    if (!exportNode) {
        return;
    }

    for (const dep of exportNode.dependencies) {
        const depFileNode = fileMap.get(dep.file);
        if (!depFileNode) {
            continue;
        }

        const depExport = depFileNode.exports.find((e) => e.name === dep.name);
        if (!depExport) {
            continue;
        }

        const nodeId = `${dep.file}:${dep.name}`;

        if (!nodeIds.has(nodeId)) {
            nodes.push({
                id: nodeId,
                name: dep.name,
                type: dep.type,
            });
            nodeIds.add(nodeId);

            links.push({
                source: parentId,
                target: nodeId,
            });

            traverseExport(
                fileMap,
                nodeIds,
                nodes,
                links,
                dep.file,
                dep.name,
                nodeId
            );
        } else {
            links.push({
                source: parentId,
                target: nodeId,
            });
        }
    }
}
