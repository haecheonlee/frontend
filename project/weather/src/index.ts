import { App } from "./component/App";
import { parse } from "./core/framework";

const app = document.getElementById("app");

if (!app) {
    throw new Error("The document is not implemented.");
}

while (app.hasChildNodes()) app.firstChild?.remove();

const html = parse(App());
if (html) {
    app.appendChild(html);
}
