import { html } from "@/core/framework";
import { SearchBox } from "./SearchBox";

function App() {
    return html`
        <div id="main">
            <div class="search-box-container">${SearchBox()}</div>
        </div>
    `;
}

export { App };
