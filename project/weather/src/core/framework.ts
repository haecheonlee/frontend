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
