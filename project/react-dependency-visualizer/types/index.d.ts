interface Component {
    file: string;
    name: string;
}

interface ComponentNode extends Component {
    imports: string[];
    renders: Component[];
}

interface CommandOptions {
    output: string;
    rootComponent?: string;
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
