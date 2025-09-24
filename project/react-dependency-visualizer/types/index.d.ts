interface Component {
    file: string;
    name: string;
}

interface ComponentInfo extends Component {
    imports: string[];
    renders: Component[];
}

interface CommandOptions {
    generateHtml?: boolean;
    output: string;
}

interface GraphNode {
    id: string;
    main: boolean;
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
