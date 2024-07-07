import { createElement } from "@/core/framework";
import { SearchComponent } from "./SearchComponent";
import { WeatherComponent } from "./WeatherComponent";
import { useState } from "@/core/hook";

function App() {
    const [city, setCity] = useState("");

    return createElement(
        "div",
        { id: "main" },
        createElement(
            "div",
            { class: "search-box-container" },
            SearchComponent({
                onChangeCallback: setCity,
            })
        ),
        WeatherComponent()
    );
}

export { App };
