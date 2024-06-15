import { createElement } from "@/core/framework";

function App(): HTMLElement {
    const container = createElement("span", {}, "This is a component!");
    return container;
}

export { App };
