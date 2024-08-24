import { it, expect, describe } from "vitest";
import { create, diff, createElement } from "./framework";

describe("framework", () => {
    describe("createElement", () => {
        it("should return text", () => {
            const result = create("text");
            expect(result.constructor.name).toBe(Text.name);
        });

        it("should return HTMLDivElement", () => {
            const result = create({
                tag: "div",
                props: {},
                children: [],
            });

            expect(result.constructor.name).toBe(HTMLDivElement.name);
        });

        it("should return props", () => {
            const result = create({
                tag: "div",
                props: { id: "test-id" },
                children: [],
            });

            expect(result.getAttribute("id")).toBe("test-id");
        });
    });

    describe("diff", () => {
        it("should return oldNode", () => {
            const oldNode = createElement("div", { id: "test-id" }, "test");
            const newNode = createElement("div", { id: "test-id" }, "test");
            expect(diff(oldNode, newNode)).toEqual(create(oldNode));
        });

        it("should return newNode", () => {
            const oldNode = createElement("div", { id: "test-id-a" }, "a");
            const newNode = createElement("div", { id: "test-id-b" }, "b");
            expect(diff(oldNode, newNode)).toEqual(create(newNode));
        });
    });
});
