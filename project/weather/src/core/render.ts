import { App } from "@/component/App";

export function render() {
    const app = document.getElementById("app");

    if (!app) {
        throw new Error("The document is not implemented.");
    }

    while (app.hasChildNodes()) app.firstChild?.remove();
    app.appendChild(App());
}