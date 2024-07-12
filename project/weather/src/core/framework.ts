export function createElement(
    tag: string,
    props: Record<string, any> = {},
    ...children: (HTMLElement | string | null)[]
): HTMLElement {
    const element = document.createElement(tag);

    for (const [key, value] of Object.entries(props)) {
        if (key.startsWith("on") && typeof value === "function") {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    }

    if (children == null) {
        return element;
    }

    for (const child of children) {
        if (child == null) {
            continue;
        }

        element.append(
            child instanceof HTMLElement
                ? child
                : document.createTextNode(child)
        );
    }

    return element;
}
