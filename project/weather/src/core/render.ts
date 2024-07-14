import { createElement, diff, VNode } from "./framework";

let oldNode: VNode | string;

export function render(newNode: VNode | string) {
    const app = document.getElementById("app");

    if (!app) {
        throw new Error("The document is not implemented.");
    }

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
}
