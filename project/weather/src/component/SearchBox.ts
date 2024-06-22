import { createElement } from "@/core/framework";

function SearchBox() {
    return createElement("input", {
        id: "searchBox",
        type: "text",
    });
}

export { SearchBox };
