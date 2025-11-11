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

interface GraphNode {
    id: string;
    name: string;
}

interface GraphLink {
    source: string;
    target: string;
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}
