import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as fs from "fs";

import type { ComponentInfo } from "./types";

export function parseComponentFile(filePath: string): ComponentInfo {
    const code = fs.readFileSync(filePath, "utf-8");
    const imports: string[] = [];
    const renders: string[] = [];

    const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
    });

    traverse(ast, {
        ImportDeclaration(path) {
            const specifier = path.node.specifiers[0];
            if (specifier && specifier.type === "ImportDefaultSpecifier") {
                imports.push(specifier.local.name);
            }
        },
        JSXOpeningElement(path) {
            const jsx = path.node.name;
            if (jsx && jsx.type === "JSXIdentifier") {
                const componentName = jsx.name;

                if (componentName[0] === componentName[0].toUpperCase()) {
                    renders.push(componentName);
                }
            }
        },
    });

    return {
        file: filePath,
        imports: [...new Set(imports)],
        renders: [...new Set(renders)],
    };
}
