import { createElement } from "@/core/framework";

function App(): HTMLElement | DocumentFragment {
    const container = createElement(
        "span",
        {},
        "This is a component!",
        createElement("", {}, "Hello World")
    );
    return container;
}

export { App };
