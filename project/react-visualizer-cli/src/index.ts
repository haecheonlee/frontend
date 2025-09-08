import { glob } from "fast-glob";
import { parseComponentFile } from "./parser";

export async function visualizeComponents(projectPath: string) {
    const files = await glob(`${projectPath}/**/*.{tsx,jsx}`, {
        ignore: ["**/node_modules/**"],
    });

    if (files.length === 0) {
        console.error("No React files found in the specified path.");
        return;
    }

    const componentData = files.map(parseComponentFile);

    componentData.forEach((data) => {
        console.log(`\nFile: ${data.file}`);
        console.log(`   Imports: ${data.imports.join(", ")}`);
        console.log(`   Renders: ${data.renders.join(", ")}`);
    });
}
