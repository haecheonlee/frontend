import { html } from "@/core/framework";

function SearchBox() {
    return html`
        <input
            id="searchBox"
            type="text"
            onkeyup="console.log('this is the keyup event.')"
        />
    `;
}

export { SearchBox };
