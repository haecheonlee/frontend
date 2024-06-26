import { App } from "./component/App";

const app = document.getElementById("app");

if (!app) {
    throw new Error("The document is not implemented.");
}

while (app.hasChildNodes()) app.firstChild?.remove();

const template = document.createElement("template");
template.innerHTML = App().trim();
app.appendChild(template.content);
