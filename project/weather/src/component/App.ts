import { html } from "@/core/framework";
import { SearchComponent } from "./SearchComponent";
import { WeatherComponent } from "./WeatherComponent";

function App() {
    return html`
        <div id="main">
            <div class="search-box-container">${SearchComponent()}</div>
            ${WeatherComponent()}
        </div>
    `;
}

export { App };
