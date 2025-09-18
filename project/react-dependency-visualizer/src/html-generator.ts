import type { ComponentInfo } from "./types";

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

function processComponentData(componentData: ComponentInfo[]): GraphData {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const nodeSet = new Set<string>();

    componentData.forEach((fileData) => {
        const { file, renders, imports } = fileData;
        if (!nodeSet.has(file)) {
            nodes.push({
                id: file,
                main: file.endsWith("App.jsx") || file.endsWith("App.tsx"),
            });
            nodeSet.add(file);
        }

        renders
            .filter((renderedComponent) => imports.includes(renderedComponent))
            .forEach((renderedComponent) => {
                if (!nodeSet.has(renderedComponent)) {
                    nodes.push({ id: renderedComponent, main: false });
                    nodeSet.add(renderedComponent);
                }
                links.push({ source: file, target: renderedComponent });
            });
    });

    return { nodes, links };
}

const SELF_CLOSING_TAGS: string[] = [
    "meta",
    "link",
    "br",
    "hr",
    "img",
    "input",
] as const;

function tag(
    name: string,
    attributes: Record<string, string> = {},
    ...children: string[]
): string {
    const attributesAsString = Object.entries(attributes)
        .map(([key, value]) => ` ${key}="${value}"`)
        .join("");

    const childAsString = children.flat().join("");
    const isSelfClosing = SELF_CLOSING_TAGS.includes(name);

    if (isSelfClosing && !childAsString) {
        return `<${name}${attributesAsString}>`;
    }

    return `<${name}${attributesAsString}>${childAsString}</${name}>`;
}

function css(
    type: "id" | "class" | "tag",
    name: string,
    properties: Partial<CSSStyleDeclaration>
): string {
    const selector = {
        class: `.${name}`,
        id: `#${name}`,
        tag: name,
    }[type];

    const styles = Object.entries(properties)
        .filter(([, value]) => value != null)
        .map(([key, value]) => {
            const keyAsKebab = key.replace(
                /[A-Z]/g,
                (m) => `-${m.toLowerCase()}`
            );
            return `    ${keyAsKebab}: ${value};`;
        })
        .join("\n");

    return `${selector} {\n${styles}\n}`;
}

function generateStyles(): string {
    const body = css("tag", "body", {
        fontFamily: "sans-serif",
        padding: "0 2rem",
        margin: "0",
        display: "flex",
        flexDirection: "center",
        alignItems: "center",
        minHeight: "100vh",
    });
    const container = css("class", "container", {
        width: "100%",
        maxWidth: "64rem",
        textAlign: "center",
    });
    const graphContainer = css("class", "graph-container", {
        width: "100%",
        height: "700px",
        backgroundColor: "black",
    });
    const node = css("class", "node", {
        stroke: "#fff",
        strokeWidth: "1.5px",
        cursor: "pointer",
    });
    const link = css("class", "link", {
        stroke: "#999",
        strokeOpacity: "0.6",
    });
    const dependencyGraph = css("id", "dependency-graph", {
        width: "100%",
        height: "100%",
    });

    return [body, container, graphContainer, node, link, dependencyGraph].join(
        "\n\n"
    );
}

function generateVisualizationScript(graphData: string): string {
    return `
        document.addEventListener('DOMContentLoaded', () => {
            const svg = d3.select("#dependency-graph");
            const graphData = ${graphData};

            function drawGraph(data) {
                svg.selectAll('*').remove();

                const width = svg.node().clientWidth;
                const height = svg.node().clientHeight;

                const simulation = d3.forceSimulation(data.nodes)
                    .force("link", d3.forceLink(data.links).id(d => d.id).distance(150))
                    .force("charge", d3.forceManyBody().strength(-300))
                    .force("center", d3.forceCenter(width / 2, height / 2));

                const node = svg.append("g")
                    .attr("class", "nodes")
                    .selectAll("g")
                    .data(data.nodes)
                    .enter().append("g")

                node.append("circle")
                    .attr("r", 15)
                    .attr("class", "node")
                    .attr("fill", d => d.main ? "#2563EB" : "#3B82F6");

                node.append("text")
                    .attr("x", 20)
                    .attr("y", 5)
                    .attr("fill", "#fff")
                    .text(d => d.id)
                    .style("pointer-events", "none");

                simulation.on("tick", () => {
                    node
                        .attr("transform", d => \`translate(\${d.x},\${d.y})\`);
                });
            }
            drawGraph(graphData);
        });
    `;
}

export function generateHtml(componentData: ComponentInfo[]): string {
    const graphData = processComponentData(componentData);
    const graphDataString = JSON.stringify(graphData, null, 2);

    const htmlContent = tag(
        "html",
        { lang: "en" },
        tag(
            "head",
            {},
            tag("meta", { charset: "utf-8" }),
            tag("meta", {
                name: "viewport",
                content: "width=device-width, initial-scale=1.0",
            }),
            tag("title", {}, "React Dependency Visualizer"),
            tag("style", {}, generateStyles())
        ),
        tag(
            "body",
            {},
            tag(
                "div",
                { class: "graph-container" },
                tag("svg", { id: "dependency-graph" })
            ),
            tag("script", {}, generateVisualizationScript(graphDataString)),
            tag("script", { src: "assets/d3.v7.min.js" })
        )
    );

    return `<!DOCTYPE html>\n${htmlContent}`.trim();
}
