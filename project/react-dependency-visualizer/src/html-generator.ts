function processComponentData(componentData: ComponentNode[]): GraphData {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const nodeSet = new Set<string>();

    componentData.forEach((fileData) => {
        const { file, name, renders, imports } = fileData;
        if (!nodeSet.has(file)) {
            nodes.push({
                id: name,
                main: file.endsWith("App.jsx") || file.endsWith("App.tsx"),
                name: file,
            });
            nodeSet.add(file);
        }

        renders
            .filter((renderedComponent) =>
                imports.includes(renderedComponent.name)
            )
            .forEach((renderedComponent) => {
                const {
                    file: renderedComponentFile,
                    name: renderedComponentName,
                } = renderedComponent;

                const key = name + renderedComponentName;
                if (!nodeSet.has(key)) {
                    nodes.push({
                        id: key,
                        main: false,
                        name: renderedComponentFile,
                    });
                    nodeSet.add(key);
                }
                links.push({ source: name, target: key });
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

export function generateHtml(componentData: ComponentNode[]): string {
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
            tag("script", { src: "assets/d3.v7.min.js" }),
            tag("script", {}, `const graphData = ${graphDataString};`),
            tag("script", { src: "dist/script-generator.js" })
        )
    );

    return `<!DOCTYPE html>\n${htmlContent}`.trim();
}
