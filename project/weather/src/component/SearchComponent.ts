import { html } from "@/core/framework";

function SearchComponent() {
    return html`
        <input
            id="search-component"
            type="text"
            onkeyup="console.log('this is the keyup event.')"
        />
    `;
}

export { SearchComponent };
