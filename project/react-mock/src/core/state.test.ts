import { describe, expect, it } from "vitest";
import { State } from "./state";

describe("State", () => {
    it("should initialize with the given state", () => {
        const initialState = 42;
        const state = new State(initialState);

        expect(state.getState()).toBe(initialState);
    });

    it("should update the state with setState", () => {
        const initialState = 42;
        const newState = 100;
        const state = new State(initialState);

        state.setState(newState);
        expect(state.getState()).toBe(newState);
    });

    it("should handle different types of state", () => {
        const initialStateString = "initial";
        const newStateString = "updated";
        const stateString = new State(initialStateString);

        stateString.setState(newStateString);
        expect(stateString.getState()).toBe(newStateString);

        const initialStateObject = { key: "value" };
        const newStateObject = { key: "newValue" };
        const stateObject = new State(initialStateObject);

        stateObject.setState(newStateObject);
        expect(stateObject.getState()).toBe(newStateObject);
    });

    it("should handle complex state changes", () => {
        const initialState = { count: 0, data: [1, 2, 3] };
        const newState = { count: 1, data: [4, 5, 6] };
        const state = new State(initialState);

        state.setState(newState);
        expect(state.getState()).toEqual(newState);
    });
});
