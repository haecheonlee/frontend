import fs from "fs";
import path from "path";
import { generateHtml } from "../generators/html";
import { loadTsConfigPaths } from "./resolver";
import { traverseComponentTree, processComponentData } from "./traverser";

export async function start(
    rootComponentPath: string,
    options: CommandOptions
) {
    const resolvedPath = path.resolve(rootComponentPath);

    if (!fs.existsSync(resolvedPath)) {
        console.error("Root component file not found:", rootComponentPath);
        return;
    }

    const projectPath = path.dirname(resolvedPath);
    const rootFile = resolvedPath;

    const tsConfigContext = loadTsConfigPaths(projectPath);

    const allComponents = new Map<string, ComponentNode>();
    const rootNode = await traverseComponentTree(
        rootFile,
        projectPath,
        tsConfigContext,
        allComponents
    );

    if (!rootNode) {
        console.error("Failed to parse root component.");
        return;
    }

    const componentData = Array.from(allComponents.values());
    const rootRelativePath = `./${path.relative(projectPath, rootFile)}`;

    if (options.output) {
        console.log(`Generating HTML file at ${options.output}...`);
        const htmlContent = generateHtml(
            processComponentData(componentData, rootRelativePath)
        );
        fs.writeFileSync(options.output, htmlContent);
        console.log(`HTML file is created at ${options.output}`);
    }

    componentData.forEach((data) => {
        console.log(`\nFile: ${data.file}`);
        console.log(`   Imports: ${data.imports.join(", ")}`);
        console.log(
            `   Renders: ${data.renders.map((p) => p.name).join(", ")}`
        );
    });
}
