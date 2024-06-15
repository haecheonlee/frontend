import { App } from "./component/App";

const app = document.getElementById("app");

if (!app) {
    throw new Error("The document is not implemented");
}

app.append(App());
