// hooks.test.ts
import { beforeEach, describe, expect, it, vitest } from "vitest";

const mocks = vitest.hoisted(() => ({
    _render: vitest.fn(),
}));

vitest.mock("./ui", () => ({
    _render: mocks._render,
}));

describe("hook", () => {
    describe("useState", () => {
        let useState: any;

        beforeEach(async () => {
            vitest.resetModules();
            const hooks = await import("./hook");
            useState = hooks.useState;
            mocks._render.mockClear();
        });

        it("should update the state and re-render when setState is called", () => {
            const [, setState] = useState(0);
            setState(1);
            expect(mocks._render).toHaveBeenCalledOnce();
        });

        it("should not update the state or re-render if the new state is the same as the old state", () => {
            const [, setState] = useState(0);
            setState(0);
            expect(mocks._render).not.toHaveBeenCalled();
        });
    });

    describe("useEffect", () => {
        let useEffect: any;

        beforeEach(async () => {
            vitest.resetModules();
            const hooks = await import("./hook");
            useEffect = hooks.useEffect;
        });

        it("should call the effect function on first render", () => {
            const effectFn = vitest.fn();
            useEffect(effectFn, [1]);

            expect(effectFn).toHaveBeenCalled();
        });

        it("should call the effect function when dependencies change", () => {
            const effectFn = vitest.fn();
            useEffect(effectFn, [1]);
            useEffect(effectFn, [2]);

            expect(effectFn).toHaveBeenCalledTimes(2);
        });

        it("should not call the effect function if dependencies do not change", () => {
            const effectFn = vitest.fn();
            useEffect(effectFn, [1]);
            useEffect(effectFn, [1]);

            expect(effectFn).toHaveBeenCalledTimes(1);
        });

        it("should call the cleanup function when dependencies change", () => {
            const cleanupFn = vitest.fn();
            const effectFn = vitest.fn(() => cleanupFn);
            useEffect(effectFn, [1]);
            useEffect(effectFn, [2]);

            expect(cleanupFn).toHaveBeenCalled();
        });

        it("should not call the cleanup function if dependencies do not change", () => {
            const cleanupFn = vitest.fn();
            const effectFn = vitest.fn(() => cleanupFn);
            useEffect(effectFn, [1]);
            useEffect(effectFn, [1]);

            expect(cleanupFn).not.toHaveBeenCalled();
        });
    });
});
