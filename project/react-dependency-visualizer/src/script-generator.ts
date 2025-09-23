declare const graphData: GraphData;

document.addEventListener("DOMContentLoaded", () => {
    const svg = d3.select("#dependency-graph");

    function drawGraph(data: GraphData) {
        svg.selectAll("*").remove();

        const svgNode = svg.node() as any;
        const width = svgNode?.clientWidth ?? 800;
        const height = svgNode?.clientHeight ?? 600;

        const simulation = d3
            .forceSimulation((data as any).nodes)
            .force(
                "link",
                d3
                    .forceLink(data.links)
                    .id((d) => (d as any).id)
                    .distance(150)
            )
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg
            .append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("stroke", "#fff")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", 2);

        const node = svg
            .append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(data.nodes)
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
            node.attr(
                "transform",
                (d) => `translate(${(d as any).x},${(d as any).y})`
            );

            link.attr("x1", (d) => (d.source as any).x)
                .attr("y1", (d) => (d.source as any).y)
                .attr("x2", (d) => (d.target as any).x)
                .attr("y2", (d) => (d.target as any).y);
        });
    }

    drawGraph(graphData);
});
