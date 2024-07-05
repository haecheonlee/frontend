import { createElement } from "@/core/framework";

function SearchComponent() {
    return createElement("input", {
        id: "search-component",
        type: "text",
        onkeyup: function () {
            console.log("this is the keyup event");
        },
    });
}

export { SearchComponent };
