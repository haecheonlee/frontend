import { createElement } from "@/core/framework";
import { useState } from "@/core/hook";

function SearchBox() {
    const [value, setValue] = useState("");

    return createElement("input", {
        id: "searchBox",
        type: "text",
        value: value,
        onkeydown: (e: InputEvent) => {
            if (e.target instanceof HTMLInputElement) {
                setValue(e.target.value);
            }
        },
    });
}

export { SearchBox };
