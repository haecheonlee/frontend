import fs from "fs";
import path from "path";
import { glob } from "fast-glob";
import { generateHtml } from "./html-generator";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

export async function start(projectPath: string, options: CommandOptions) {
    const files = await glob(
        `${projectPath}/**/${options.rootComponent ?? "*"}.{tsx,jsx}`,
        {
            ignore: ["**/node_modules/**"],
        }
    );

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

function parseComponentFile(filePath: string): ComponentNode {
    const code = fs.readFileSync(filePath, "utf-8");
    const imports: string[] = [];
    const renders: Component[] = [];

    const importMap: Record<string, string> = {};

    const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
    });

    const baseFileName = path.basename(filePath, path.extname(filePath)); // e.g., MyComponent

    traverse(ast, {
        ImportDeclaration(path) {
            const importPath = path.node.source.value;

            path.node.specifiers.forEach((specifier) => {
                if (
                    specifier.type === "ImportDefaultSpecifier" ||
                    specifier.type === "ImportSpecifier"
                ) {
                    const name = specifier.local.name;
                    importMap[name] = importPath;
                    imports.push(name);
                }
            });
        },

        JSXOpeningElement(path) {
            const jsx = path.node.name;
            if (jsx && jsx.type === "JSXIdentifier") {
                const componentName = jsx.name;

                if (componentName[0] === componentName[0].toUpperCase()) {
                    const resolved = importMap[componentName];

                    renders.push({
                        file: resolved,
                        name: componentName,
                    });
                }
            }
        },
    });

    return {
        file: filePath,
        name: baseFileName,
        imports: [...new Set(imports)],
        renders: [...new Set(renders)],
    };
}
