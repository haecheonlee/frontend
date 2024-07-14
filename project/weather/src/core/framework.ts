export type VNode = {
    tag: string;
    props: Record<string, any>;
    children: (VNode | string | null)[];
};

export function v(
    tag: string,
    props: Record<string, any> = {},
    ...children: (VNode | string | null)[]
): VNode {
    return { tag, props, children };
}

export function createElement(node: VNode | string): HTMLElement | Text {
    if (typeof node === "string") {
        return document.createTextNode(node);
    }

    const element = createElementWithProps(node.tag, node.props);
    for (const child of node.children) {
        if (!child) {
            continue;
        }

        element.append(createElement(child));
    }

    return element;
}

export function diff(
    oldNode: VNode | string | null,
    newNode: VNode | string | null
): HTMLElement | Text | null {
    if (!newNode) {
        return document.createTextNode("");
    }

    if (!oldNode) {
        return createElement(newNode);
    }

    if (typeof oldNode !== typeof newNode) {
        return createElement(newNode);
    }

    if (typeof oldNode === "string" && typeof newNode === "string") {
        if (oldNode !== newNode) {
            return document.createTextNode(newNode);
        } else {
            return document.createTextNode(oldNode);
        }
    } else if (typeof oldNode !== "string" && typeof newNode !== "string") {
        if (oldNode.tag !== newNode.tag) {
            return createElement(newNode);
        }

        const element = createElementWithProps(newNode.tag, newNode.props);
        const oldChildren = oldNode.children;
        const newChildren = newNode.children;

        const maxLength = Math.max(oldChildren.length, newChildren.length);

        for (let i = 0; i < maxLength; i++) {
            const children = diff(oldChildren[i], newChildren[i]);

            if (children) {
                element.appendChild(children);
            }
        }

        return element;
    }

    return null;
}

function createElementWithProps(tag: string, props: Record<string, any>) {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
        if (key.startsWith("on") && typeof value === "function") {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    }

    return element;
}
