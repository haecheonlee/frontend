export function createElement(
    tag: string,
    props: { [key: string]: any } = {},
    ...children: (HTMLElement | string)[]
): HTMLElement {
    const element = document.createElement(tag);

    for (const [key, value] of Object.entries(props)) {
        if (key.startsWith("on") && typeof value === "function") {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    }

    for (const child of children) {
        element.append(
            child instanceof HTMLElement
                ? child
                : document.createTextNode(child)
        );
    }

    return element;
}
