interface ComponentInfo {
    file: string;
    imports: string[];
    renders: string[];
}

interface CommandOptions {
    generateHtml?: boolean;
    output: string;
}

interface GraphNode {
    id: string;
    main: boolean;
}

interface GraphLink {
    source: string;
    target: string;
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}
