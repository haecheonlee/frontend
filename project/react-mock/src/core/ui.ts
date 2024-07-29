import { createElement, diff, VNode } from "./framework";
import { debounceByAnimationFrame } from "../util/helper";

let root: HTMLElement | null = null;
let entryPoint: null | (() => VNode) = null;
let oldNode: VNode | string | null;

export function createRoot(element: HTMLElement) {
    root = element;
    return {
        render: (component: () => VNode) => {
            entryPoint = component;
            _render();
        },
    };
}

export const _render = debounceByAnimationFrame(() => {
    if (!root) {
        throw new Error("The root is not initialized.");
    }

    if (!entryPoint) {
        throw new Error("Set the entry point.");
    }

    const newNode = entryPoint();
    if (!oldNode) {
        root.appendChild(createElement(newNode));
    } else {
        const newChildren = diff(oldNode, newNode);

        if (newChildren) {
            root.replaceChild(newChildren, root.firstChild!);
        } else {
            root.removeChild(root.firstChild!);
        }
    }

    oldNode = newNode;
});
