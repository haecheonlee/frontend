import { createRoot, _render } from "../src/core/ui";
import { App } from "./component/App";

createRoot(document.getElementById("app")!).render(App);
