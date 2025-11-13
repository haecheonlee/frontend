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
    const html = css("tag", "html", {
        margin: "0",
        padding: "0",
        height: "100%",
    });
    const body = css("tag", "body", {
        fontFamily: "sans-serif",
        margin: "0",
        padding: "0",
        height: "100%",
        overflow: "hidden",
    });
    const graphContainer = css("class", "graph-container", {
        width: "100%",
        height: "100%",
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

    return [html, body, graphContainer, node, link, dependencyGraph].join(
        "\n\n"
    );
}

export function generateHtml(graphData: DeprecatedGraphData): string {
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
            tag("script", { src: "../assets/d3.v7.min.js" }),
            tag("script", {}, `const graphData = ${graphDataString};`),
            tag("script", { src: "./generators/script.js" })
        )
    );

    return `<!DOCTYPE html>\n${htmlContent}`.trim();
}
