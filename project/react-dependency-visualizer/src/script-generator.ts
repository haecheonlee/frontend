declare const graphData: GraphData;

type SimulationNode = GraphNode & d3.SimulationNodeDatum;
type SimulationLink = d3.SimulationLinkDatum<SimulationNode>;
type HierarchyNode = d3.HierarchyPointNode<GraphNode>;

document.addEventListener("DOMContentLoaded", () => {
    const svg = d3.select<SVGSVGElement, unknown>("#dependency-graph");

    function drawGraph(data: GraphData) {
        svg.selectAll("*").remove();

        const rootNode = data.nodes.find((n) => n.main) || data.nodes[0];
        const nodeMap = new Map<
            string,
            GraphNode & { children?: GraphNode[] }
        >();
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

        const svgNode = svg.node();
        const isSvgElement = svgNode instanceof SVGSVGElement;
        const width = isSvgElement ? svgNode.clientWidth : 800;
        const height = isSvgElement ? svgNode.clientHeight : 600;

        const root = nodeMap.get(rootNode.id)!;
        const treeLayout = d3
            .tree<GraphNode>()
            .size([width - 100, height - 100])
            .separation((a, b) => (a.parent === b.parent ? 1 : 1.5));

        const hierarchy = d3.hierarchy(root);
        const treeData = treeLayout(hierarchy);

        const g = svg.append("g").attr("transform", `translate(50, 50)`);
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
                    .linkVertical<
                        d3.HierarchyPointLink<GraphNode>,
                        HierarchyNode
                    >()
                    .x((d) => d.x)
                    .y((d) => d.y)
            );

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

        node.append("text")
            .attr("x", 20)
            .attr("y", 5)
            .attr("fill", "#fff")
            .text((d) => d.data.name)
            .style("pointer-events", "none");
    }

    drawGraph(graphData);
});
