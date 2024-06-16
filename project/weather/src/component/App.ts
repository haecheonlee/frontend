import { createElement } from "@/core/framework";

function App(): HTMLElement | DocumentFragment {
    const container = createElement(
        "div",
        {
            id: "main",
        },
        "This is a component!",
        createElement("", {}, "Hello World")
    );
    return container;
}

export { App };
