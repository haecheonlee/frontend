import { JSDOM } from "jsdom";
const jsdom = new JSDOM(undefined, { url: "https://localhost/ " });
global.document = jsdom.window.document;
global.window = jsdom.window;
