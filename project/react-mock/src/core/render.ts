import { createElement, diff, VNode } from "./framework";
import { debounceByAnimationFrame } from "@/util/helper";

let entryPoint: null | (() => VNode) = null;
let oldNode: VNode | string | null;

export const register = (component: () => VNode) => {
    entryPoint = component;
};

export const render = debounceByAnimationFrame(() => {
    const app = document.getElementById("app");

    if (!app) {
        throw new Error("The document is not implemented.");
    }

    if (!entryPoint) {
        throw new Error("Set the entry point.");
    }

    const newNode = entryPoint();
    if (!oldNode) {
        app.appendChild(createElement(newNode));
    } else {
        const newChildren = diff(oldNode, newNode);

        if (newChildren) {
            app.replaceChild(newChildren, app.firstChild!);
        } else {
            app.removeChild(app.firstChild!);
        }
    }

    oldNode = newNode;
});
