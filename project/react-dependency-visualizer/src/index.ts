import { glob } from "fast-glob";
import { parseComponentFile } from "./parser";
import { generateHtml } from "./html-generator";
import * as fs from "fs";

export async function visualizeComponents(
    projectPath: string,
    options: CommandOptions
) {
    const files = await glob(`${projectPath}/**/*.{tsx,jsx}`, {
        ignore: ["**/node_modules/**"],
    });

    if (files.length === 0) {
        console.error("No React files found in the specified path.");
        return;
    }

    const componentData = files.map(parseComponentFile);

    if (options.output) {
        console.log(`Generating HTML file at ${options.output}...`);
        const htmlContent = generateHtml(componentData);
        fs.writeFileSync(options.output, htmlContent);
        console.log(`HTML file is created at ${options.output}`);
    }

    componentData.forEach((data) => {
        console.log(`\nFile: ${data.file}`);
        console.log(`   Imports: ${data.imports.join(", ")}`);
        console.log(
            `   Renders: ${data.renders.map((p) => p.file).join(", ")}`
        );
    });
}
