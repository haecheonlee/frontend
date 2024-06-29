function create(element: Node): DOMObject | TextObject | null {
    if (element.nodeType === Node.TEXT_NODE) {
        const textContext = element.textContent?.trim();

        if (!textContext) {
            return null;
        }

        return {
            tagName: "text",
            textContent: textContext || "",
        };
    }

    if (!(element instanceof Element)) {
        return null;
    }

    const obj: DOMObject = {
        tagName: element.tagName.toLowerCase(),
        attributes: {},
        children: [],
        events: {},
    };

    for (const attr of element.attributes) {
        if (attr.name.startsWith("on")) {
            obj.events[attr.name.substring(2)] = new Function(
                "event",
                attr.value
            ) as (event: Event) => any;
        } else {
            obj.attributes[attr.name] = attr.value;
        }
    }

    for (const child of element.childNodes) {
        const object = create(child);
        if (object) {
            obj.children.push(object);
        }
    }

    return obj;
}

function convert(object: DOMObject | TextObject): HTMLElement | Text {
    if ("textContent" in object) {
        return document.createTextNode(object.textContent);
    }

    const element = document.createElement(object.tagName);

    for (const [key, value] of Object.entries(object.attributes)) {
        element.setAttribute(key, value);
    }

    for (const [event, listener] of Object.entries(object.events)) {
        console.log(element, event, listener);
        element.addEventListener(event, (e) => listener(e));
    }

    for (const child of object.children) {
        element.appendChild(convert(child));
    }

    return element;
}

export function html(strings: TemplateStringsArray, ...values: string[]) {
    return strings
        .reduce(
            (accumulative, string, index) =>
                accumulative + string + (values[index] || ""),
            ""
        )
        .trim();
}

export function parse(html: string): HTMLElement | Text | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    if (!doc.body.firstChild) {
        throw new Error("The format of html string is invalid.");
    }

    const object = create(doc.body.firstChild);

    if (!object) {
        return null;
    }

    return convert(object);
}
