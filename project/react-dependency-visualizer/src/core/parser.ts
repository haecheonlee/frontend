import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import type * as t from "@babel/types";

export function parseComponentFile(
    filePath: string,
    projectPath: string
): FileNode {
    const code = fs.readFileSync(filePath, "utf-8");
    const importMap: Record<string, string> = {};
    const exportNodes = new Map<string, ExportNode>();
    const functionScopes = new Map<string, Dependency[]>();

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
                }
            });
        },

        FunctionDeclaration(path) {
            if (path.node.id) {
                const functionName = path.node.id.name;
                const deps = analyzeFunctionBody(path, importMap);
                functionScopes.set(functionName, deps);
            }
        },

        VariableDeclarator(path) {
            if (
                path.node.id.type === "Identifier" &&
                (path.node.init?.type === "ArrowFunctionExpression" ||
                    path.node.init?.type === "FunctionExpression")
            ) {
                const functionName = path.node.id.name;
                const functionPath = path.get("init");
                const deps = analyzeFunctionBody(functionPath, importMap);
                functionScopes.set(functionName, deps);
            }
        },

        ExportDefaultDeclaration(path) {
            const declaration = path.node.declaration;
            let exportName = baseFileName;

            if (declaration.type === "Identifier") {
                exportName = declaration.name;
            } else if (
                declaration.type === "FunctionDeclaration" &&
                declaration.id
            ) {
                exportName = declaration.id.name;
            }

            exportNodes.set(exportName, {
                name: exportName,
                dependencies: functionScopes.get(exportName) || [],
            });
        },

        ExportNamedDeclaration(path) {
            const declaration = path.node.declaration;

            if (path.node.specifiers.length > 0) {
                path.node.specifiers.forEach((specifier) => {
                    if (specifier.type === "ExportSpecifier") {
                        const localName = specifier.local.name;
                        const exportName =
                            specifier.exported.type === "Identifier"
                                ? specifier.exported.name
                                : specifier.exported.value;

                        exportNodes.set(exportName, {
                            name: exportName,
                            dependencies: functionScopes.get(localName) || [],
                        });
                    }
                });
            }

            if (declaration) {
                if (
                    declaration.type === "FunctionDeclaration" &&
                    declaration.id
                ) {
                    const exportName = declaration.id.name;
                    exportNodes.set(exportName, {
                        name: exportName,
                        dependencies: functionScopes.get(exportName) || [],
                    });
                } else if (declaration.type === "VariableDeclaration") {
                    declaration.declarations.forEach((declarator) => {
                        if (declarator.id.type === "Identifier") {
                            const exportName = declarator.id.name;
                            exportNodes.set(exportName, {
                                name: exportName,
                                dependencies:
                                    functionScopes.get(exportName) || [],
                            });
                        }
                    });
                }
            }
        },
    });

    const relativeFilePath = `./${path.relative(projectPath, filePath)}`;

    return {
        file: relativeFilePath,
        exports: Array.from(exportNodes.values()),
    };
}

function analyzeFunctionBody(
    functionPath:
        | NodePath<t.Expression | null | undefined>
        | NodePath<t.FunctionDeclaration>,
    importMap: Record<string, string>
): Dependency[] {
    const dependencies: Dependency[] = [];
    const seen = new Set<string>();

    functionPath.traverse({
        JSXOpeningElement(path) {
            const jsx = path.node.name;
            if (jsx && jsx.type === "JSXIdentifier") {
                const componentName = jsx.name;
                if (componentName[0] === componentName[0].toUpperCase()) {
                    const file = importMap[componentName];
                    if (file) {
                        const key = `${componentName}:${file}`;
                        if (!seen.has(key)) {
                            seen.add(key);
                            dependencies.push({
                                name: componentName,
                                file,
                                type: "component",
                            });
                        }
                    }
                }
            }
        },

        CallExpression(path) {
            const callee = path.node.callee;

            if (callee.type !== "Identifier") {
                return;
            }

            const name = callee.name;
            if (name.startsWith("use") && !isBuiltInReactHook(name)) {
                const file = importMap[name];
                if (file) {
                    const key = `${name}:${file}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        dependencies.push({
                            name,
                            file,
                            type: "hook",
                        });
                    }
                }
            }
        },
    });

    return dependencies;
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
