interface VNode {
    tag: string;
    props: Record<string, any>;
    children: NodeType[];
}

type NodeType = VNode | string | null;
