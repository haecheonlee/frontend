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

interface Component {
    file: string;
    name: string;
}

interface ComponentNode extends Component {
    imports: string[];
    renders: Component[];
    hooks: Component[];
    exports: string[];
}

interface CommandOptions {
    output: string;
}

interface GraphLink {
    source: string;
    target: string;
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

interface DeprecatedGraphNode {
    id: string;
    name: string;
}

interface DeprecatedGraphData {
    nodes: DeprecatedGraphNode[];
    links: GraphLink[];
}
