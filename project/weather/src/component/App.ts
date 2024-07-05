import { createElement } from "@/core/framework";
import { SearchComponent } from "./SearchComponent";
import { WeatherComponent } from "./WeatherComponent";

function App() {
    return createElement(
        "div",
        { id: "main" },
        createElement(
            "div",
            { class: "search-box-container" },
            SearchComponent()
        ),
        WeatherComponent()
    );
}

export { App };
