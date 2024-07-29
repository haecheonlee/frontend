import { beforeEach, describe, expect, it, vitest } from "vitest";
import { _render, createRoot } from "./ui";
import { VNode } from "./framework";

const mocks = vitest.hoisted(() => {
    return {
        createElement: vitest.fn((p: VNode) => document.createElement(p.tag)),
        diff: vitest.fn((oldNode: VNode, newNode: VNode) =>
            document.createElement(
                oldNode != newNode ? newNode.tag : oldNode.tag
            )
        ),
    };
});

vitest.mock("../util/helper", () => ({
    debounceByAnimationFrame: vitest.fn((fn) => fn),
}));

vitest.mock("./framework", () => ({
    createElement: mocks.createElement,
    diff: mocks.diff,
}));

describe("ui", () => {
    let rootElement: HTMLDivElement;
    let component: () => VNode;

    beforeEach(() => {
        rootElement = document.createElement("div");
        component = vitest.fn(() => ({ tag: "span", props: {}, children: [] }));
    });

    it("should throw an error if root is not initialized", () => {
        expect(() => _render()).toThrow("The root is not initialized.");
    });

    it("should throw an error if entryPoint is not set", () => {
        createRoot(rootElement);
        expect(() => _render()).toThrow("Set the entry point.");
    });

    it("should createRoot and render for the first time", () => {
        const rootInstance = createRoot(rootElement);
        rootInstance.render(component);

        expect(mocks.createElement).toHaveBeenCalledOnce();
        expect(component).toHaveBeenCalled();
        expect(rootElement.firstChild).not.toBeNull();
        expect(rootElement.firstElementChild?.tagName).toBe("SPAN");
    });

    it("should call diff when re-rendering", () => {
        _render();
        expect(mocks.diff).toHaveBeenCalledOnce();
    });
});
