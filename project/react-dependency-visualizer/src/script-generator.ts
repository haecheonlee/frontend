declare const graphData: GraphData;

type HierarchyNode = d3.HierarchyPointNode<GraphNode>;

function buildHierarchy(
    data: GraphData
): GraphNode & { children?: GraphNode[] } {
    const rootNode = data.nodes.find((n) => n.main) || data.nodes[0];
    const nodeMap = new Map<string, GraphNode & { children?: GraphNode[] }>();

    data.nodes.forEach((node) => {
        nodeMap.set(node.id, { ...node, children: [] });
    });

    data.links.forEach((link) => {
        const parent = nodeMap.get(link.source);
        const child = nodeMap.get(link.target);
        if (parent && child) {
            parent.children!.push(child);
        }
    });

    return nodeMap.get(rootNode.id)!;
}

function getSvgDimensions(
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
): { width: number; height: number } {
    const svgNode = svg.node();
    const isSvgElement = svgNode instanceof SVGSVGElement;
    return {
        width: isSvgElement ? svgNode.clientWidth : 800,
        height: isSvgElement ? svgNode.clientHeight : 600,
    };
}

function createTreeLayout(
    width: number,
    height: number
): d3.TreeLayout<GraphNode> {
    return d3
        .tree<GraphNode>()
        .size([width - 100, height - 100])
        .separation((a, b) => (a.parent === b.parent ? 1.5 : 2));
}

function generateTreeData(
    root: GraphNode & { children?: GraphNode[] },
    treeLayout: d3.TreeLayout<GraphNode>
): HierarchyNode {
    const hierarchy = d3.hierarchy(root);
    return treeLayout(hierarchy);
}

function setupZoom(
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    g: d3.Selection<SVGGElement, unknown, HTMLElement, any>
): void {
    const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });

    svg.call(zoom);

    const initialTransform = d3.zoomIdentity.translate(50, 50);
    svg.call(zoom.transform, initialTransform);
}

function renderLinks(
    g: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    treeData: HierarchyNode
): void {
    g.append("g")
        .attr("class", "links")
        .selectAll<SVGPathElement, d3.HierarchyPointLink<GraphNode>>("path")
        .data(treeData.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 2)
        .attr(
            "d",
            d3
                .linkVertical<d3.HierarchyPointLink<GraphNode>, HierarchyNode>()
                .x((d) => d.x)
                .y((d) => d.y)
        );
}

function truncateText(text: string, maxLength: number = 20): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
}

function getTextWidth(text: string, fontSize: number = 12): number {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
        context.font = `${fontSize}px sans-serif`;
        return context.measureText(text).width;
    }
    return text.length * fontSize * 0.6;
}

function renderNodes(
    g: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    treeData: HierarchyNode
): void {
    const maxTextWidth = 150;
    const fontSize = 12;

    const node = g
        .append("g")
        .attr("class", "nodes")
        .selectAll<SVGGElement, HierarchyNode>("g")
        .data(treeData.descendants())
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

    node.append("circle")
        .attr("r", 15)
        .attr("class", "node")
        .attr("fill", (d) => (d.data.main ? "#2563EB" : "#3B82F6"));

    const textElements = node
        .append("text")
        .attr("x", 0)
        .attr("y", -25)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .attr("font-size", `${fontSize}px`)
        .style("pointer-events", "none");

    textElements.each(function (d) {
        const textElement = d3.select(this);
        let displayText = d.data.name;
        let textWidth = getTextWidth(displayText, fontSize);

        if (textWidth > maxTextWidth) {
            let truncated = displayText;
            while (
                getTextWidth(truncated + "...", fontSize) > maxTextWidth &&
                truncated.length > 0
            ) {
                truncated = truncated.substring(0, truncated.length - 1);
            }
            displayText = truncated + "...";
        }

        textElement.text(displayText);
    });

    node.append("title").text((d) => d.data.name);

    node.each(function (d) {
        const textNode = d3
            .select(this)
            .select("text")
            .node() as SVGTextElement;
        if (textNode) {
            const bbox = textNode.getBBox();
            d3.select(this)
                .insert("rect", "text")
                .attr("x", bbox.x - 4)
                .attr("y", bbox.y - 2)
                .attr("width", bbox.width + 8)
                .attr("height", bbox.height + 4)
                .attr("fill", "rgba(0, 0, 0, 0.7)")
                .attr("rx", 3);
        }
    });
}

function drawGraph(
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    data: GraphData
): void {
    svg.selectAll("*").remove();

    const root = buildHierarchy(data);

    const { width, height } = getSvgDimensions(svg);

    const treeLayout = createTreeLayout(width, height);
    const treeData = generateTreeData(root, treeLayout);

    const g = svg.append("g");

    setupZoom(svg, g);

    renderLinks(g, treeData);
    renderNodes(g, treeData);
}

document.addEventListener("DOMContentLoaded", () => {
    const svg = d3.select<SVGSVGElement, unknown>("#dependency-graph");
    drawGraph(svg, graphData);
});
