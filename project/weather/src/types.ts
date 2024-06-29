interface DOMObject {
    tagName: string;
    attributes: Record<string, string>;
    children: Array<DOMObject | TextObject>;
    events: Record<string, (event: Event) => any>;
}

interface TextObject {
    tagName: "text";
    textContent: string;
}
