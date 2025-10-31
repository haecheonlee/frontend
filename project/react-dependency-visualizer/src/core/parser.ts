import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

export function parseComponentFile(
    filePath: string,
    projectPath: string
): ComponentNode {
    const code = fs.readFileSync(filePath, "utf-8");
    const imports: string[] = [];
    const renders: Component[] = [];
    const hooks: Component[] = [];
    const importMap: Record<string, string> = {};

    const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
    });

    const baseFileName = path.basename(filePath, path.extname(filePath));

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

        CallExpression(path) {
            const callee = path.node.callee;

            if (callee.type !== "Identifier") {
                return;
            }

            const functionName = callee.name;
            if (
                !functionName.startsWith("use") ||
                isBuiltInReactHook(functionName)
            ) {
                return;
            }

            const importPath = importMap[functionName];

            if (!importPath) {
                return;
            }

            hooks.push({
                name: functionName,
                file: importPath,
            });
        },
    });

    const relativeFilePath = `./${path.relative(projectPath, filePath)}`;

    return {
        file: relativeFilePath,
        name: baseFileName,
        imports: [...new Set(imports)],
        renders: removeDuplicateComponents(renders),
        hooks: removeDuplicateComponents(hooks),
    };
}

function isBuiltInReactHook(name: string): boolean {
    const builtInHooks = [
        "useState",
        "useEffect",
        "useContext",
        "useReducer",
        "useCallback",
        "useMemo",
        "useRef",
        "useImperativeHandle",
        "useLayoutEffect",
        "useDebugValue",
        "useDeferredValue",
        "useTransition",
        "useId",
        "useSyncExternalStore",
        "useInsertionEffect",
        "useEvent",
        "useOptimistic",
        "useActionState",
        "useEffectEvent",
    ];

    return builtInHooks.includes(name);
}

function removeDuplicateComponents(components: Component[]): Component[] {
    const seen = new Set<string>();
    return components.filter((comp) => {
        const key = `${comp.name}:${comp.file}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}
