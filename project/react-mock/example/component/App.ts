import { v } from "../../src/core/framework";
import { useEffect, useState } from "../../src/core/hook";

function App() {
    const [value, setValue] = useState("");

    useEffect(() => {
        alert("This is fired from useEffect: " + value);
    }, [value]);

    return v(
        "div",
        {},
        v("input", {
            type: "text",
            value: value,
            onkeyup: function (event) {
                if (event.target instanceof HTMLInputElement) {
                    setValue(event.target.value);
                }
            },
        }),
        v("div", {}, `The value is ${value}`)
    );
}

export { App };
