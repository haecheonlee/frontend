import { createElement } from "@/core/framework";
import { SearchBox } from "./SearchBox";

function App(): HTMLElement | DocumentFragment {
    return createElement(
        "div",
        {
            id: "main",
        },
        createElement(
            "div",
            {
                class: "search-box-container",
            },
            SearchBox()
        )
    );
}

export { App };
