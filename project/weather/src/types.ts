interface DOMObject {
    tagName: string;
    attributes: { [key: string]: string };
    children: Array<DOMObject | TextObject>;
}

interface TextObject {
    tagName: "text";
    textContent: string;
}
