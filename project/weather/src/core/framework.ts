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
    };

    for (const attr of element.attributes) {
        obj.attributes[attr.name] = attr.value;
    }

    for (const child of element.childNodes) {
        const object = create(child);
        if (object) {
            obj.children.push(object);
        }
    }

    return obj;
}

export function createElement(
    tag: string,
    props: { [key: string]: any } = {},
    ...children: (HTMLElement | DocumentFragment | string)[]
): HTMLElement | DocumentFragment {
    if (!tag) {
        const fragment = document.createDocumentFragment();
        for (const child of children) {
            if (child !== null && child !== undefined) {
                fragment.appendChild(
                    typeof child === "string"
                        ? document.createTextNode(child)
                        : child
                );
            }
        }
        return fragment;
    }

    const element = document.createElement(tag);

    for (const [key, value] of Object.entries(props)) {
        if (key.startsWith("on") && typeof value === "function") {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    }

    for (const child of children) {
        if (child !== null && child !== undefined) {
            element.appendChild(
                typeof child === "string"
                    ? document.createTextNode(child)
                    : child
            );
        }
    }

    return element;
}

export function parse(html: string): DOMObject | TextObject {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const result = [];
    for (let child of doc.body.childNodes) {
        const childObject = create(child);
        if (childObject) {
            result.push(childObject);
        }
    }
    return result[0];
}

export function generate(obj: DOMObject | TextObject): string {
    if ("textContent" in obj) {
        return obj.textContent;
    }

    let html = `<${obj.tagName}`;

    if (obj.attributes) {
        for (const [key, value] of Object.entries(obj.attributes)) {
            html += ` ${key}="${value}"`;
        }
    }

    html += ">";

    if (obj.children && obj.children.length > 0) {
        for (const child of obj.children) {
            html += generate(child);
        }
    }

    html += `</${obj.tagName}>`;

    return html;
}
