import { it, expect, describe } from "vitest";
import { createElement, diff, v } from "./framework";

describe("framework", () => {
    describe("createElement", () => {
        it("should return text", () => {
            const result = createElement("text");
            expect(result.constructor.name).toBe(Text.name);
        });

        it("should return HTMLDivElement", () => {
            const result = createElement({
                tag: "div",
                props: {},
                children: [],
            });

            expect(result.constructor.name).toBe(HTMLDivElement.name);
        });

        it("should return props", () => {
            const result = createElement({
                tag: "div",
                props: { id: "test-id" },
                children: [],
            });

            expect(result.getAttribute("id")).toBe("test-id");
        });
    });

    describe("diff", () => {
        it("should return oldNode", () => {
            const oldNode = v("div", { id: "test-id" }, "test");
            const newNode = v("div", { id: "test-id" }, "test");
            expect(diff(oldNode, newNode)).toEqual(createElement(oldNode));
        });

        it("should return newNode", () => {
            const oldNode = v("div", { id: "test-id-a" }, "a");
            const newNode = v("div", { id: "test-id-b" }, "b");
            expect(diff(oldNode, newNode)).toEqual(createElement(newNode));
        });
    });
});
