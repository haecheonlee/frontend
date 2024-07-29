import { afterEach, beforeEach, describe, expect, it, vitest } from "vitest";
import { debounceByAnimationFrame } from "./helper";

describe("debounceByAnimationFrame", () => {
    beforeEach(() => {
        global.requestAnimationFrame = vitest.fn();
    });

    afterEach(() => {
        vitest.clearAllMocks();
    });

    it("should debounce calls and execute the function once per animation frame", () => {
        const mockFn = vitest.fn();

        const debouncedFn = debounceByAnimationFrame(mockFn);
        debouncedFn();

        expect(global.requestAnimationFrame).toHaveBeenCalledTimes(1);
        setTimeout(() => {
            expect(mockFn).toHaveBeenCalledTimes(1);
        }, 16);
    });
});
