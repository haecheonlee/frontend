declare const graphData: GraphData;

type SimulationNode = GraphNode & d3.SimulationNodeDatum;
type SimulationLink = d3.SimulationLinkDatum<SimulationNode>;

document.addEventListener("DOMContentLoaded", () => {
    const svg = d3.select<SVGSVGElement, unknown>("#dependency-graph");

    function drawGraph(data: GraphData) {
        svg.selectAll("*").remove();

        const svgNode = svg.node();
        const isSvgElement = svgNode instanceof SVGSVGElement;
        const width = isSvgElement ? svgNode.clientWidth : 800;
        const height = isSvgElement ? svgNode.clientHeight : 600;

        const nodes: SimulationNode[] = data.nodes.map((d) => ({ ...d }));
        const links: SimulationLink[] = data.links.map((d) => ({ ...d }));

        const simulation = d3
            .forceSimulation<SimulationNode>(nodes)
            .force(
                "link",
                d3
                    .forceLink<SimulationNode, SimulationLink>(links)
                    .id((d) => d.id)
                    .distance(150)
            )
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg
            .append("g")
            .attr("class", "links")
            .selectAll<SVGLineElement, SimulationLink>("line")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("stroke", "#fff")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", 2);

        const node = svg
            .append("g")
            .attr("class", "nodes")
            .selectAll<SVGGElement, SimulationNode>("g")
            .data(nodes)
            .enter()
            .append("g");

        node.append("circle")
            .attr("r", 15)
            .attr("class", "node")
            .attr("fill", (d) => (d.main ? "#2563EB" : "#3B82F6"));

        node.append("text")
            .attr("x", 20)
            .attr("y", 5)
            .attr("fill", "#fff")
            .text((d) => d.name)
            .style("pointer-events", "none");

        simulation.on("tick", () => {
            node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);

            link.attr("x1", (d) =>
                typeof d.source === "object" ? d.source.x ?? 0 : 0
            )
                .attr("y1", (d) =>
                    typeof d.source === "object" ? d.source.y ?? 0 : 0
                )
                .attr("x2", (d) =>
                    typeof d.target === "object" ? d.target.x ?? 0 : 0
                )
                .attr("y2", (d) =>
                    typeof d.target === "object" ? d.target.y ?? 0 : 0
                );
        });
    }

    drawGraph(graphData);
});
