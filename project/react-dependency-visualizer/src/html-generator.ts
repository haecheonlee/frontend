import type { ComponentInfo } from "./types";

export function generateHtml(componentData: ComponentInfo[]) {
    const nodes: Array<{ id: string; main: boolean }> = [];
    const links: Array<{ source: string; target: string }> = [];
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

    const graphData = JSON.stringify({ nodes, links }, null, 2);
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Dependency Visualizer</title>
</head>
<body>
    <script src="assets/d3.v7.min.js" />
</body>
</html>`;
}
