interface Dependency {
    name: string;
    file: string;
    type: "component" | "hook";
}

interface ExportNode {
    name: string;
    dependencies: Dependency[];
}

interface FileNode {
    file: string;
    exports: ExportNode[];
}

interface CommandOptions {
    output: string;
    exclude?: string;
}

interface GraphLink {
    source: string;
    target: string;
}

interface GraphNode {
    id: string;
    name: string;
    type: "component" | "hook";
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

interface TsConfigContext {
    baseUrl: string;
    pathMappings: Record<string, string[]>;
    projectRoot: string;
}
