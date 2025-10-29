import fs from "fs";
import path from "path";
import { TsConfigContext, resolveImportPath } from "./resolver";
import { parseComponentFile } from "./parser";

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
            const resolvedPath = path.resolve(renderPath);
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

    return node;
}

export function processComponentData(
    componentData: ComponentNode[],
    startFile: string
): GraphData {
    const fileMap = new Map(componentData.map((comp) => [comp.file, comp]));
    const nodeIds = new Set<string>();
    const nodes: GraphNode[] = [];
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
    nodes: GraphNode[],
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

    return nodeId;
}
