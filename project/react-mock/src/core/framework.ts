export function createElement(
    tag: VNode["tag"],
    props: VNode["props"] = {},
    ...children: VNode["children"]
): VNode {
    return { tag, props, children };
}

export function create(node: string): Text;
export function create(node: VNode): HTMLElement;
export function create(node: string | VNode): Text | HTMLElement;
export function create<T extends VNode | string>(node: T) {
    if (typeof node === "string") {
        return document.createTextNode(node);
    }

    const element = createElementWithProps(node.tag, node.props);
    for (const child of node.children) {
        if (!child) {
            continue;
        }

        element.append(create(child));
    }

    return element;
}

export function diff(
    oldNode: NodeType,
    newNode: NodeType
): HTMLElement | Text | null {
    if (!newNode) {
        return document.createTextNode("");
    }

    if (!oldNode) {
        return create(newNode);
    }

    if (typeof oldNode !== typeof newNode) {
        return create(newNode);
    }

    if (typeof oldNode === "string" && typeof newNode === "string") {
        if (oldNode !== newNode) {
            return document.createTextNode(newNode);
        } else {
            return document.createTextNode(oldNode);
        }
    } else if (typeof oldNode !== "string" && typeof newNode !== "string") {
        if (oldNode.tag !== newNode.tag) {
            return create(newNode);
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

function createElementWithProps(tag: VNode["tag"], props: VNode["props"]) {
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
