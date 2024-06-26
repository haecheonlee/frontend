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

export function html(strings: TemplateStringsArray, ...values: string[]) {
    const htmlString = strings.reduce(
        (accumulative, string, index) =>
            accumulative + string + (values[index] || ""),
        ""
    );

    const parsedHtml = parse(htmlString.trim());
    return generate(parsedHtml);
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
