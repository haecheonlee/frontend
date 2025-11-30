/// <reference path="../../types/index.d.ts" />

import * as d3 from "d3";

declare const graphData: GraphData;

type HierarchyNode = d3.HierarchyPointNode<GraphNode>;

let selectedComponentName: string | null = null;

function buildHierarchy(
    data: GraphData
): GraphNode & { children?: GraphNode[] } {
    const rootNode = data.nodes[0];
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
        .filter((event) => {
            if (event.type === "dblclick") {
                const target = event.target;
                return target instanceof Element && !target.closest(".nodes g");
            }
            return true;
        })
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
        .attr("stroke", (d) => {
            return d.target.data.type === "hook" ? "#A78BFA" : "#fff";
        })
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", (d) => {
            return d.target.data.type === "hook" ? 1.5 : 2;
        })
        .attr("stroke-dasharray", (d) => {
            return d.target.data.type === "hook" ? "5,5" : "none";
        })
        .attr(
            "d",
            d3
                .linkVertical<d3.HierarchyPointLink<GraphNode>, HierarchyNode>()
                .x((d) => d.x)
                .y((d) => d.y)
        );
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

function getNodeRadius(): number {
    return 10;
}

function getNodeColor(
    type: DependencyType,
    isSelected: boolean,
    hasSelection: boolean
): string {
    if (isSelected) {
        return type === "hook" ? "#C084FC" : "#F59E0B";
    }
    if (hasSelection) {
        return "#4B5563";
    }
    return type === "hook" ? "#8B5CF6" : "#3B82F6";
}

function getNodeStroke(type: DependencyType, isSelected: boolean): string {
    if (!isSelected) return "none";
    return type === "hook" ? "#DDD6FE" : "#FCD34D";
}

function updateNodeHighlighting(
    node: d3.Selection<SVGGElement, HierarchyNode, SVGGElement, unknown>
): void {
    const hasSelection = selectedComponentName !== null;

    node.selectAll<SVGGElement, HierarchyNode>("circle")
        .attr("fill", (d) => {
            const isSelected = d.data.name === selectedComponentName;
            return getNodeColor(d.data.type, isSelected, hasSelection);
        })
        .attr("stroke", (d) => {
            const isSelected = d.data.name === selectedComponentName;
            return getNodeStroke(d.data.type, isSelected);
        })
        .attr("stroke-width", (d) => {
            return d.data.name === selectedComponentName ? 3 : 0;
        });

    node.selectAll<SVGAElement, HierarchyNode>("rect").attr("fill", (d) => {
        if (selectedComponentName === null) {
            return d.data.type === "hook"
                ? "rgba(139, 92, 246, 0.8)"
                : "rgba(0, 0, 0, 0.7)";
        }
        const isSelected = d.data.name === selectedComponentName;
        if (isSelected) {
            return d.data.type === "hook"
                ? "rgba(192, 132, 252, 0.9)"
                : "rgba(245, 158, 11, 0.9)";
        }
        return "rgba(75, 85, 99, 0.7)";
    });

    node.selectAll<SVGAElement, HierarchyNode>("text")
        .attr("fill", (d) => {
            if (selectedComponentName === null) {
                return "#fff";
            }
            return d.data.name === selectedComponentName ? "#fff" : "#9CA3AF";
        })
        .attr("font-weight", (d) => {
            return d.data.name === selectedComponentName ? "bold" : "normal";
        });
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
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .style("cursor", "pointer");

    node.append("circle")
        .attr("r", () => getNodeRadius())
        .attr("class", "node")
        .attr("fill", (d) => getNodeColor(d.data.type, false, false));

    const textElements = node
        .append("text")
        .attr("x", 0)
        .attr("y", -25)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .attr("font-size", `${fontSize}px`)
        .attr("font-style", (d) =>
            d.data.type === "hook" ? "italic" : "normal"
        )
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

    node.append("title").text((d) => {
        const type = d.data.type === "hook" ? "Hook" : "Component";
        return `${d.data.name} (${type})`;
    });

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
                .attr(
                    "fill",
                    d.data.type === "hook"
                        ? "rgba(139, 92, 246, 0.8)"
                        : "rgba(0, 0, 0, 0.7)"
                )
                .attr("rx", 3);
        }
    });

    node.on("click", function (event, d) {
        event.stopPropagation();

        if (selectedComponentName === d.data.name) {
            selectedComponentName = null;
        } else {
            selectedComponentName = d.data.name;
        }

        const selectedNodes = node.filter((n) => n.data.name === d.data.name);
        selectedNodes.raise();

        updateNodeHighlighting(node);
    });

    const svg = d3.select<SVGSVGElement, unknown>("#dependency-graph");
    svg.on("click", () => {
        if (selectedComponentName !== null) {
            selectedComponentName = null;
            updateNodeHighlighting(node);

            node.sort((a, b) => {
                return (a.depth || 0) - (b.depth || 0);
            });
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
