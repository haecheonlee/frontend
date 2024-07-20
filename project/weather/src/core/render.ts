import { App } from "@/component/App";
import { createElement, diff, VNode } from "./framework";
import { debounceByAnimationFrame } from "@/util/helper";

let oldNode: VNode | string;

export const render = debounceByAnimationFrame(() => {
    const app = document.getElementById("app");

    if (!app) {
        throw new Error("The document is not implemented.");
    }

    const newNode = App();
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
